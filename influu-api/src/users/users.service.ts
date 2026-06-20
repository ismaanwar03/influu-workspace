import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService }   from '../prisma/prisma.service';
import { UpdateBrandDto }  from './dto/update-brand.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ── BRAND PROFILE ─────────────────────────────────────────
  async getBrandProfile(userId: string) {
    const brand = await this.prisma.brandProfile.findUnique({
      where:   { userId },
      include: {
        user:      { select: { id:true, name:true, email:true, avatarUrl:true, createdAt:true } },
        campaigns: { where: { status: 'active' }, orderBy: { createdAt: 'desc' }, take: 5 },
        _count:    { select: { campaigns:true, contracts:true } },
      },
    });
    if (!brand) throw new NotFoundException('Brand profile not found');
    return brand;
  }

  async updateBrandProfile(userId: string, dto: UpdateBrandDto) {
    return this.prisma.brandProfile.update({
      where: { userId },
      data:  dto,
    });
  }

  // ── CREATOR PROFILE ───────────────────────────────────────
  async getCreatorProfile(userId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where:   { userId },
      include: {
        user:          { select: { id:true, name:true, email:true, avatarUrl:true, createdAt:true } },
        socialAccounts: true,
        packages:       { where: { isActive: true } },
        _count:         { select: { contracts:true } },
      },
    });
    if (!creator) throw new NotFoundException('Creator profile not found');
    return creator;
  }

  async updateCreatorProfile(userId: string, dto: UpdateCreatorDto) {
    return this.prisma.creatorProfile.update({
      where: { userId },
      data:  dto,
    });
  }

  // ── PUBLIC CREATOR DIRECTORY ──────────────────────────────
  async searchCreators(params: {
    niche?:       string;
    platform?:    string;
    minFollowers?: number;
    search?:      string;
    page?:        number;
    limit?:       number;
  }) {
    const { niche, platform, minFollowers, search, page = 1, limit = 20 } = params;

    const where: any = { availability: 'available' };

    if (niche)  where.niche = { contains: niche, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { niche: { contains: search, mode: 'insensitive' } },
        { city:  { contains: search, mode: 'insensitive' } },
        { user:  { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (platform || minFollowers) {
      where.socialAccounts = {
        some: {
          ...(platform     ? { platform: platform as any } : {}),
          ...(minFollowers ? { followers: { gte: minFollowers } } : {}),
          isVerified: true,
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.creatorProfile.findMany({
        where,
        skip:    (page - 1) * limit,
        take:    limit,
        orderBy: { rating: 'desc' },
        include: {
          user:           { select: { name:true, avatarUrl:true } },
          socialAccounts: { where: { isVerified: true } },
          packages:       { where: { isActive: true }, take: 4 },
        },
      }),
      this.prisma.creatorProfile.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPublicCreatorById(creatorId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where:   { id: creatorId },
      include: {
        user:           { select: { name:true, avatarUrl:true, createdAt:true } },
        socialAccounts: { where: { isVerified:true }, select: { platform:true, username:true, followers:true, engagementRate:true } },
        packages:       { where: { isActive: true } },
        _count:         { select: { contracts: true } },
      },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    return creator;
  }

  // ── PACKAGES ──────────────────────────────────────────────
  async createPackage(creatorId: string, data: {
    platform: string; contentType: string;
    price: number; deliveryDays: number; description?: string;
  }) {
    return this.prisma.package.create({
      data: {
        creatorId,
        title:       `${data.platform} ${data.contentType}`,
        platform:    data.platform    as any,
        contentType: data.contentType as any,
        price:       data.price,
        deliveryDays: data.deliveryDays,
        description: data.description,
      },
    });
  }

  async updatePackage(id: string, creatorId: string, data: Partial<{
    price: number; deliveryDays: number; description: string; isActive: boolean;
  }>) {
    return this.prisma.package.updateMany({
      where: { id, creatorId },
      data,
    });
  }

  async getCreatorPackages(creatorId: string) {
    return this.prisma.package.findMany({
      where:   { creatorId },
      orderBy: { platform: 'asc' },
    });
  }
}
