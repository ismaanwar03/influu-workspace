import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import axios from 'axios'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name)
  private readonly FEE_PERCENT = 8

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // ── CREATE PAYMENT INTENT (Paymob) ────────────────────────
  async createPaymentIntent(dto: CreatePaymentDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: dto.contractId },
      include: { brand: { include: { user: true } } },
    })
    if (!contract) throw new NotFoundException('Contract not found')
    if (contract.status !== 'active') {
      throw new BadRequestException('Contract must be active before payment')
    }

    const amount = Number(contract.amount)
    const fee = Math.round((amount * this.FEE_PERCENT) / 100)
    const payout = amount - fee
    const amountPt = amount * 100

    const { data: auth } = await axios.post(
      'https://accept.paymob.com/api/auth/tokens',
      { api_key: this.config.get('PAYMOB_API_KEY') },
    )

    const { data: order } = await axios.post(
      'https://accept.paymob.com/api/ecommerce/orders',
      {
        auth_token: auth.token,
        delivery_needed: false,
        amount_cents: amountPt,
        currency: 'PKR',
        merchant_order_id: dto.contractId,
        items: [
          {
            name: `Influu Campaign — Contract #${dto.contractId.slice(0, 8)}`,
            amount_cents: amountPt,
            quantity: 1,
          },
        ],
      },
    )

    const user = contract.brand.user
    const { data: keyRes } = await axios.post(
      'https://accept.paymob.com/api/acceptance/payment_keys',
      {
        auth_token: auth.token,
        amount_cents: amountPt,
        expiration: 3600,
        order_id: order.id,
        billing_data: {
          email: user.email,
          first_name: user.name.split(' ')[0],
          last_name: user.name.split(' ')[1] ?? 'N/A',
          phone_number: 'N/A',
          country: 'PK',
          city: 'Karachi',
          street: 'N/A',
          building: 'N/A',
          floor: 'N/A',
          apartment: 'N/A',
          postal_code: 'N/A',
          state: 'N/A',
        },
        currency: 'PKR',
        integration_id: this.config.get('PAYMOB_INTEGRATION_ID'),
      },
    )

    await this.prisma.escrowTransaction.create({
      data: {
        contractId: dto.contractId,
        totalAmount: amount,
        platformFee: fee,
        creatorPayout: payout,
        status: 'locked',
        paymentMethod: dto.paymentMethod as any,
        paymobOrderId: String(order.id),
      },
    })

    const iframeId = this.config.get('PAYMOB_IFRAME_ID')
    return {
      paymentKey: keyRes.token,
      orderId: order.id,
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${keyRes.token}`,
      amount,
      fee,
      payout,
    }
  }

  // ── VERIFY PAYMOB CALLBACK ────────────────────────────────
  async verifyPaymobCallback(data: any) {
    const orderId = String(data.obj?.order?.merchant_order_id)
    const success = data.obj?.success === true

    if (!success) {
      this.logger.warn(`Payment failed for contract ${orderId}`)
      return { success: false }
    }

    await this.prisma.escrowTransaction.updateMany({
      where: { contractId: orderId },
      data: {
        paymobRef: String(data.obj?.id),
        lockedAt: new Date(),
      },
    })

    this.logger.log(`Payment confirmed for contract ${orderId}`)
    return { success: true, contractId: orderId }
  }

  // ── RELEASE PAYMENT ────────────────────────────────────────
  async releasePayment(contractId: string) {
    const escrow = await this.prisma.escrowTransaction.findUnique({
      where: { contractId },
      include: { contract: { include: { creator: true } } },
    })

    if (!escrow || escrow.status !== 'locked') {
      throw new BadRequestException('Escrow not ready for release')
    }

    await Promise.all([
      this.prisma.escrowTransaction.update({
        where: { contractId },
        data: { status: 'released', releasedAt: new Date() },
      }),
      this.prisma.contract.update({
        where: { id: contractId },
        data: { status: 'payment_released' },
      }),
    ])

    const creatorUserId = escrow.contract.creator.userId
    await this.prisma.notification.create({
      data: {
        userId: creatorUserId,
        type: 'payment_released',
        title: 'Payment released! 💰',
        message: `PKR ${Number(escrow.creatorPayout).toLocaleString('en-PK')} has been released.`,
      },
    })

    await this.triggerWebhook('MAKE_WEBHOOK_PAYMENT_RELEASED', {
      contractId,
      amount: Number(escrow.creatorPayout),
      creatorId: escrow.contract.creatorId,
    })

    this.logger.log(
      `Payment released for contract ${contractId}: PKR ${escrow.creatorPayout}`,
    )
    return { released: true, amount: escrow.creatorPayout }
  }

  // ── REFUND ────────────────────────────────────────────────
  async refund(contractId: string, reason: string) {
    await Promise.all([
      this.prisma.escrowTransaction.updateMany({
        where: { contractId },
        data: { status: 'refunded' },
      }),
      this.prisma.contract.update({
        where: { id: contractId },
        data: { status: 'cancelled' },
      }),
    ])
    this.logger.log(`Refund issued for contract ${contractId}: ${reason}`)
    return { refunded: true }
  }

  // ── GET ESCROW STATUS ─────────────────────────────────────
  async getStatus(contractId: string) {
    const escrow = await this.prisma.escrowTransaction.findUnique({
      where: { contractId },
    })
    if (!escrow) throw new NotFoundException('No escrow record found')
    return escrow
  }

  // ── TRANSACTION HISTORY ───────────────────────────────────
  async getHistory(userId: string, role: string) {
    const where: any = {}
    if (role === 'brand') {
      where.contract = { brand: { userId } }
    } else {
      where.contract = { creator: { userId } }
    }
    return this.prisma.escrowTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contract: {
          select: {
            id: true,
            platform: true,
            contentType: true,
            brand: { select: { companyName: true } },
            creator: { select: { user: { select: { name: true } } } },
          },
        },
      },
    })
  }

  // ── CRON: CHECK EXPIRED TIMERS EVERY HOUR ─────────────────
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiredTimers() {
    this.logger.log('⏰ Checking expired payment timers…')
    try {
      const due = await this.prisma.contentSubmission.findMany({
        where: {
          status: 'verified',
          timerEndsAt: { lte: new Date() },
          contract: { status: 'timer_running' },
        },
        include: { contract: true },
      })

      for (const sub of due) {
        try {
          const stillLive = await this.checkPostStillLive(sub)
          if (stillLive) {
            await this.releasePayment(sub.contractId)
            this.logger.log(
              `Auto-released payment for contract ${sub.contractId}`,
            )
          }
        } catch (err) {
          this.logger.error(
            `Failed auto-release check for contract ${sub.contractId}`,
            err,
          )
        }
      }
    } catch (err) {
      this.logger.error('Error during checkExpiredTimers cron job', err)
    }
  }

  // ── CRON: AUTO APPROVE STALE DRAFTS EVERY HOUR ────────────
  @Cron(CronExpression.EVERY_HOUR)
  async autoApproveStaleDrafts() {
    this.logger.log('⏰ Checking for stale submission drafts…')
    try {
      const staleDrafts = await this.prisma.contentDraft.findMany({
        where: {
          status: 'pending_review',
          createdAt: { lte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        },
      })
      this.logger.log(`Found ${staleDrafts.length} stale drafts to process.`)
    } catch (err) {
      this.logger.error('Error during autoApproveStaleDrafts cron job', err)
    }
  }

  // ── HELPERS PLACEHOLDERS ──────────────────────────────────
  private async checkPostStillLive(submission: any): Promise<boolean> {
    return true
  }

  private async triggerWebhook(key: string, payload: any): Promise<void> {
    this.logger.log(`Triggering webhook ${key}...`)
  }
}
