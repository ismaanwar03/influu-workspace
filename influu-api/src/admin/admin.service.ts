import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ── PLATFORM OVERVIEW ─────────────────────────────────────
  async getStats() {
    const [users, campaigns, contracts, escrow, disputes] = await Promise.all([
      this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      this.prisma.campaign.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.contract.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.escrowTransaction.aggregate({
        _sum:   { totalAmount: true, platformFee: true },
        _count: { _all: true },
      }),
      this.prisma.dispute.count({ where: { status: 'open' } }),
    ]);

    return {
      users:          users.reduce((a, r) => ({ ...a, [r.role]: r._count._all }), {}),
      campaigns:      campaigns.reduce((a, r) => ({ ...a, [r.status]: r._count._all }), {}),
      contracts:      contracts.reduce((a, r) => ({ ...a, [r.status]: r._count._all }), {}),
      totalEscrow:    escrow._sum.totalAmount,
      totalFees:      escrow._sum.platformFee,
      totalTransactions: escrow._count._all,
      openDisputes:   disputes,
    };
  }

  // ── DISPUTE MANAGEMENT ────────────────────────────────────
  async listDisputes(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contract:   { include: { brand: true, creator: true } },
        raisedBy:   { select: { name: true, email: true } },
      },
    });
  }

  async resolveDispute(
    disputeId:   string,
    moderatorId: string,
    resolution:  string,
    favour:      'brand' | 'creator',
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where:   { id: disputeId },
      include: { contract: true },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');

    const finalStatus = favour === 'creator'
      ? 'resolved_creator'
      : 'resolved_brand';

    await Promise.all([
      this.prisma.dispute.update({
        where: { id: disputeId },
        data:  { status: finalStatus as any, resolution, moderatorId, resolvedAt: new Date() },
      }),
      this.prisma.contract.update({
        where: { id: dispute.contractId },
        data:  { status: favour === 'creator' ? 'payment_released' : 'cancelled' },
      }),
    ]);

    return { resolved: true, favour, disputeId };
  }

  // ── MODERATION QUEUE ──────────────────────────────────────
  async getModerationQueue() {
    const [staleDrafts, exceedRevisions, openDisputes] = await Promise.all([
      // Drafts pending > 48 hours (should have been auto-approved)
      this.prisma.contentDraft.findMany({
        where: {
          status:      'pending_review',
          submittedAt: { lte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        },
        include: { contract: { include: { brand: true, creator: true } } },
        take: 20,
      }),
      // Contracts where revision limit exceeded
      this.prisma.contract.findMany({
        where: {
          status: 'active',
          revisionsUsed: { gte: 3 },
        },
        include: { brand: true, creator: true },
        take: 20,
      }),
      // Open disputes
      this.prisma.dispute.findMany({
        where:   { status: 'open' },
        include: { contract: true, raisedBy: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
        take:    20,
      }),
    ]);

    return { staleDrafts, exceedRevisions, openDisputes };
  }

  // ── USER MANAGEMENT ───────────────────────────────────────
  async listUsers(role?: string, page = 1, limit = 30) {
    const where: any = {};
    if (role) where.role = role;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip:    (page - 1) * limit,
        take:    limit,
        orderBy: { createdAt: 'desc' },
        select:  {
          id:true, name:true, email:true, role:true,
          isVerified:true, isActive:true, createdAt:true,
          brandProfile:   { select: { companyName:true, totalCampaigns:true } },
          creatorProfile: { select: { niche:true, totalDeals:true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id: userId },
      data:  { isActive: !user.isActive },
    });
  }
}
