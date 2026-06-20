import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private readonly prisma: PrismaService;
  private readonly jwt: JwtService;
  private readonly config: ConfigService;

  // 🚀 FIXED: Added @Inject tokens to force NestJS to populate references without metadata
  constructor(
    @Inject(PrismaService) prisma: PrismaService,
    @Inject(JwtService) jwt: JwtService,
    @Inject(ConfigService) config: ConfigService,
  ) {
    this.prisma = prisma;
    this.jwt = jwt;
    this.config = config;
  }

  async signup(dto: SignupDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const rounds = Number(this.config.get<number>('BCRYPT_ROUNDS', 12));
    const hash = await bcrypt.hash(dto.password, rounds);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        role: dto.role as any,
        ...(dto.role === 'brand'
          ? { brandProfile: { create: { companyName: dto.name, industry: '' } } }
          : {}),
        ...(dto.role === 'creator' ? { creatorProfile: { create: {} } } : {}),
      },
      select: { id: true, name: true, email: true, role: true, isVerified: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user, tokens };
  }

  async login(dto: LoginDto) {
    if (!dto || !dto.email) {
      throw new BadRequestException('Email field is required');
    }

    // 1. Fetch user cleanly using the restored prisma client mapping
    const foundUser = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Validate password hash
    const valid = await bcrypt.compare(dto.password, foundUser.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!foundUser.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    // 3. Dispatch access tokens
    const tokens = await this.generateTokens(
      foundUser.id,
      foundUser.email,
      foundUser.role,
    );

    return {
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isVerified: foundUser.isVerified,
        avatarUrl: foundUser.avatarUrl,
        createdAt: foundUser.createdAt,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, isActive: true },
      });
      if (!user || !user.isActive) throw new UnauthorizedException();
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return { accessToken: tokens.accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
        brandProfile: {
          select: { id: true, companyName: true, industry: true, rating: true },
        },
        creatorProfile: {
          select: { id: true, bio: true, niche: true, city: true, rating: true, availability: true },
        },
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '30d'),
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
