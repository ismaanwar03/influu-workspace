import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(brandId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        brandId,
        title:        dto.title,
        platform:     dto.platform     as any,
        contentType:  dto.contentType  as any,
        brief:        dto.brief,
        budget:       dto.budget,
        deadline:     new Date(dto.deadline),
        minFollowers: dto.minFollowers ?? 0,
        maxRevisions: dto.maxRevisions ?? 2,
      },
      include: { brand: { include: { user: { select: { name:true, email:true } } } } },
    });
  }

  async findAll(params: { status?: string; platform?: string; page?: number; limit?: number }) {
    const { status, platform, page = 1, limit = 20 } = params;
    const where: any = { status: 'active' };
    if (status)   where.status   = status;
    if (platform) where.platform = platform;

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip:    (page - 1) * limit,
        take:    limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: { select: { companyName:true, industry:true, rating:true } },
          _count: { select: { contracts: true } },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where:   { id },
      include: {
        brand:     { include: { user: { select: { name:true, avatarUrl:true } } } },
        contracts: { select: { id:true, status:true } },
        _count:    { select: { contracts: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async findByBrand(brandId: string, status?: string) {
    const where: any = { brandId };
    if (status) where.status = status;
    return this.prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { contracts: true } } },
    });
  }

  async update(id: string, brandId: string, dto: UpdateCampaignDto) {
    await this.verifyOwnership(id, brandId);
    return this.prisma.campaign.update({
      where: { id },
      data:  {
        ...dto,
        platform:    dto.platform    as any,
        contentType: dto.contentType as any,
        deadline:    dto.deadline ? new Date(dto.deadline) : undefined,
        budget:      dto.budget,
      },
    });
  }

  async remove(id: string, brandId: string) {
    await this.verifyOwnership(id, brandId);
    return this.prisma.campaign.update({
      where: { id },
      data:  { status: 'cancelled' },
    });
  }

  private async verifyOwnership(campaignId: string, brandId: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign)                      throw new NotFoundException('Campaign not found');
    if (campaign.brandId !== brandId)   throw new ForbiddenException('Not your campaign');
    return campaign;
  }
}
