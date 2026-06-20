import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service'
import { CreateContractDto } from './dto/create-contract.dto'
import { ReviewDraftDto } from './dto/review-draft.dto'
import { SubmitDraftDto } from './dto/submit-draft.dto'
import { SubmitPostUrlDto } from './dto/submit-post.dto'

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name)

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // ── CREATE CONTRACT ──────────────────────────────────────
  async create(brandId: string, dto: CreateContractDto) {
    const platformFee = Math.round((dto.amount * 8) / 100)
    const creatorPayout = dto.amount - platformFee

    const contract = await this.prisma.contract.create({
      data: {
        brandId,
        creatorId: dto.creatorId,
        campaignId: dto.campaignId,
        packageId: dto.packageId,
        platform: dto.platform as any,
        contentType: dto.contentType as any,
        amount: dto.amount,
        deadline: new Date(dto.deadline),
        maxRevisions: dto.maxRevisions ?? 2,
      },
      include: this.contractIncludes(),
    })

    this.logger.log(`Contract created: ${contract.id}`)
    return contract
  }

  // ── LIST CONTRACTS ───────────────────────────────────────
  async findAll(userId: string, role: string, status?: string) {
    const where: any = {}
    if (role === 'brand') where.brand = { userId }
    if (role === 'creator') where.creator = { userId }
    if (status) where.status = status

    return this.prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: this.contractIncludes(),
    })
  }

  // ── GET ONE CONTRACT ─────────────────────────────────────
  async findOne(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        ...this.contractIncludes(),
        drafts: { orderBy: { version: 'desc' } },
        submission: true,
        messages: { orderBy: { createdAt: 'asc' }, take: 50 },
      },
    })
    if (!contract) throw new NotFoundException('Contract not found')
    this.assertAccess(contract, userId)
    return contract
  }

  // ── SIGN CONTRACT ────────────────────────────────────────
  async sign(id: string, userId: string, role: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } })
    if (!contract) throw new NotFoundException('Contract not found')

    const update: any = {}
    if (role === 'brand') update.brandSignedAt = new Date()
    if (role === 'creator') update.creatorSignedAt = new Date()

    const bothSigned =
      role === 'brand' ? !!contract.creatorSignedAt : !!contract.brandSignedAt

    if (bothSigned) update.status = 'active'

    return this.prisma.contract.update({
      where: { id },
      data: update,
      include: this.contractIncludes(),
    })
  }

  // ── SUBMIT DRAFT ─────────────────────────────────────────
  async submitDraft(contractId: string, userId: string, dto: SubmitDraftDto) {
    const contract = await this.getAndVerifyContract(contractId, userId)

    if (!['active', 'draft_submitted'].includes(contract.status)) {
      throw new BadRequestException(
        'Contract is not in a state that accepts drafts',
      )
    }

    const lastDraft = await this.prisma.contentDraft.findFirst({
      where: { contractId },
      orderBy: { version: 'desc' },
    })

    const version = (lastDraft?.version ?? 0) + 1

    const draft = await this.prisma.contentDraft.create({
      data: {
        contractId,
        version,
        fileUrls: dto.fileUrls,
        caption: dto.caption,
        hashtags: dto.hashtags ?? '',
      },
    })

    await this.prisma.contract.update({
      where: { id: contractId },
      data: { status: 'draft_submitted' },
    })

    this.logger.log(`Draft v${version} submitted for contract ${contractId}`)
    return draft
  }

  // ── REVIEW DRAFT ─────────────────────────────────────────
  async reviewDraft(
    contractId: string,
    draftId: string,
    userId: string,
    dto: ReviewDraftDto,
  ) {
    const contract = await this.getAndVerifyContract(contractId, userId)

    const draft = await this.prisma.contentDraft.findFirst({
      where: { id: draftId, contractId },
    })
    if (!draft) throw new NotFoundException('Draft not found')

    if (dto.decision === 'approve') {
      await Promise.all([
        this.prisma.contentDraft.update({
          where: { id: draftId },
          data: { status: 'approved', reviewedAt: new Date() },
        }),
        this.prisma.contract.update({
          where: { id: contractId },
          data: { status: 'draft_approved' },
        }),
      ])
      this.logger.log(`Draft ${draftId} approved for contract ${contractId}`)
      return { message: 'Draft approved. Creator can now post live.' }
    }

    // Request revision
    if (contract.revisionsUsed >= contract.maxRevisions) {
      throw new BadRequestException(
        'Maximum revisions reached. A moderator will review.',
      )
    }

    await Promise.all([
      this.prisma.contentDraft.update({
        where: { id: draftId },
        data: {
          status: 'revision_requested',
          revisionReason: dto.feedback,
          reviewedAt: new Date(),
        },
      }),
      this.prisma.contract.update({
        where: { id: contractId },
        data: { status: 'active', revisionsUsed: { increment: 1 } },
      }),
    ])

    return { message: 'Revision requested. Creator has been notified.' }
  }

  // ── SUBMIT POST URL ───────────────────────────────────────
  async submitPostUrl(
    contractId: string,
    userId: string,
    dto: SubmitPostUrlDto,
  ) {
    await this.getAndVerifyContract(contractId, userId)

    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    })
    if (contract?.status !== 'draft_approved') {
      throw new BadRequestException(
        'Draft must be approved before submitting post URL',
      )
    }

    const submission = await this.prisma.contentSubmission.upsert({
      where: { contractId },
      create: {
        contractId,
        postUrl: dto.postUrl,
        platform: contract.platform,
        status: 'pending_review',
      },
      update: {
        postUrl: dto.postUrl,
        status: 'pending_review',
        verifiedAt: null,
        timerEndsAt: null,
      },
    })

    await this.prisma.contract.update({
      where: { id: contractId },
      data: { status: 'post_live' },
    })

    this.logger.log(
      `Post URL submitted for contract ${contractId}: ${dto.postUrl}`,
    )
    return submission
  }

  // ── HELPERS ──────────────────────────────────────────────
  private contractIncludes() {
    return {
      brand: {
        select: {
          companyName: true,
          rating: true,
          user: { select: { name: true, avatarUrl: true } },
        },
      },
      creator: {
        select: {
          bio: true,
          niche: true,
          rating: true,
          user: { select: { name: true, avatarUrl: true } },
        },
      },
      escrow: true,
      submission: true,
    }
  }

  private async getAndVerifyContract(contractId: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        brand: { include: { user: true } },
        creator: { include: { user: true } },
      },
    })
    if (!contract) throw new NotFoundException('Contract not found')
    this.assertAccess(contract, userId)
    return contract
  }

  private assertAccess(contract: any, userId: string) {
    const isBrand = contract.brand?.userId === userId
    const isCreator = contract.creator?.userId === userId
    if (!isBrand && !isCreator) throw new ForbiddenException('Access denied')
  }
}
