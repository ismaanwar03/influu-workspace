import { Injectable, Logger } from '@nestjs/common';
import { PrismaService }      from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    type: string,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ) {
    return this.prisma.notification.create({
      data: { userId, type: type as any, title, message, metadata },
    });
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      take:    50,
    });
  }

  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data:  { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true },
    });
  }

  // ── TYPED HELPERS ─────────────────────────────────────────
  async notifyDraftSubmitted(brandUserId: string, contractId: string, creatorName: string) {
    return this.create(
      brandUserId,
      'draft_submitted',
      'Draft ready for review',
      `${creatorName} has submitted a draft. Review and approve to let them post live.`,
      { contractId },
    );
  }

  async notifyDraftApproved(creatorUserId: string, contractId: string) {
    return this.create(
      creatorUserId,
      'draft_approved',
      'Draft approved! 🎉 You can post now',
      'Your draft was approved. Post your content live and submit the URL.',
      { contractId },
    );
  }

  async notifyRevisionRequested(creatorUserId: string, contractId: string, feedback: string) {
    return this.create(
      creatorUserId,
      'draft_revision',
      'Revision requested',
      `Feedback: ${feedback.slice(0, 120)}${feedback.length > 120 ? '…' : ''}`,
      { contractId },
    );
  }

  async notifyPostVerified(brandUserId: string, creatorUserId: string, contractId: string) {
    await Promise.all([
      this.create(brandUserId, 'post_verified', 'Post verified ✓', 'The post is live and verified. Payment timer has started.', { contractId }),
      this.create(creatorUserId, 'post_verified', 'Post verified — timer started ⏰', 'Your post is verified. Payment will release automatically when the timer expires.', { contractId }),
    ]);
  }

  async notifyPaymentReleased(creatorUserId: string, amount: number, contractId: string) {
    return this.create(
      creatorUserId,
      'payment_released',
      'Payment released! 💰',
      `₹${amount.toLocaleString('en-PK')} has been released to your account.`,
      { contractId, amount },
    );
  }

  async notifyContractSigned(creatorUserId: string, brandName: string, contractId: string) {
    return this.create(
      creatorUserId,
      'contract_signed',
      'New contract from ' + brandName,
      `${brandName} has sent you a contract. Review and sign to get started.`,
      { contractId },
    );
  }

  async notifyDisputeOpened(userId: string, contractId: string) {
    return this.create(
      userId,
      'dispute_opened',
      'Dispute opened',
      'A dispute has been opened on your contract. Our team will review within 24 hours.',
      { contractId },
    );
  }
}
