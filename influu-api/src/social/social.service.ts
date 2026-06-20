import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

export interface PostVerificationResult {
  exists:    boolean;
  isPublic:  boolean;
  postId:    string | null;
  platform:  string;
  accountMatch: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class SocialService {
  private readonly logger = new Logger(SocialService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // ── PHYLLO: CONNECT ACCOUNT ───────────────────────────────
  async createPhylloUser(creatorUserId: string) {
    const clientId     = this.config.get('PHYLLO_CLIENT_ID');
    const clientSecret = this.config.get('PHYLLO_CLIENT_SECRET');
    const baseUrl      = this.config.get('PHYLLO_BASE_URL', 'https://api.getphyllo.com');

    // Get Phyllo access token
    const { data: tokenRes } = await axios.post(
      `${baseUrl}/v1/sdk-tokens`,
      { client_display_name: 'Influu.pk', redirect_uri: '' },
      { auth: { username: clientId, password: clientSecret } },
    );

    return { sdkToken: tokenRes.sdk_token, userId: tokenRes.user_id };
  }

  // ── PHYLLO: SYNC ACCOUNT STATS ────────────────────────────
  async syncPhylloAccount(creatorId: string, platform: string, phylloAccountId: string) {
    const clientId     = this.config.get('PHYLLO_CLIENT_ID');
    const clientSecret = this.config.get('PHYLLO_CLIENT_SECRET');
    const baseUrl      = this.config.get('PHYLLO_BASE_URL', 'https://api.getphyllo.com');

    const { data: account } = await axios.get(
      `${baseUrl}/v1/accounts/${phylloAccountId}`,
      { auth: { username: clientId, password: clientSecret } },
    );

    const followers      = account?.follower_count ?? 0;
    const engagementRate = account?.engagement_rate ?? 0;
    const username       = account?.username ?? '';

    await this.prisma.socialAccount.upsert({
      where:  { creatorId_platform: { creatorId, platform: platform as any } },
      create: {
        creatorId,
        platform:      platform as any,
        username,
        platformUserId: account.id ?? '',
        followers,
        engagementRate,
        phylloUserId:  phylloAccountId,
        isVerified:    true,
        lastSyncedAt:  new Date(),
      },
      update: {
        followers,
        engagementRate,
        isVerified:   true,
        lastSyncedAt: new Date(),
      },
    });

    this.logger.log(`Synced ${platform} for creator ${creatorId}: ${followers} followers`);
    return { followers, engagementRate, username };
  }

  // ── VERIFY POST — DISPATCHER ──────────────────────────────
  async verifyPost(
    postUrl: string,
    platform: string,
    expectedUsername?: string,
  ): Promise<PostVerificationResult> {
    this.logger.log(`Verifying post [${platform}]: ${postUrl}`);

    try {
      switch (platform.toLowerCase()) {
        case 'instagram': return await this.verifyInstagramPost(postUrl, expectedUsername);
        case 'tiktok':    return await this.verifyTikTokPost(postUrl, expectedUsername);
        case 'youtube':   return await this.verifyYouTubePost(postUrl, expectedUsername);
        default:          return await this.verifyGenericPost(postUrl, platform);
      }
    } catch (err) {
      this.logger.error(`Post verification failed: ${err}`);
      return {
        exists: false, isPublic: false,
        postId: null, platform, accountMatch: false,
      };
    }
  }

  // ── INSTAGRAM GRAPH API ───────────────────────────────────
  private async verifyInstagramPost(
    postUrl: string,
    expectedUsername?: string,
  ): Promise<PostVerificationResult> {
    const postId = this.extractInstagramId(postUrl);
    if (!postId) return this.failedResult('instagram');

    // Requires creator's access token stored in social_accounts
    // In production: lookup creator's IG access token from DB
    // For now: use app-level token (limited access)
    const token = this.config.get('INSTAGRAM_ACCESS_TOKEN');

    try {
      const { data } = await axios.get(
        `https://graph.instagram.com/${postId}`,
        {
          params: {
            fields:       'id,media_type,timestamp,username,permalink',
            access_token: token,
          },
          timeout: 8000,
        },
      );

      const accountMatch = expectedUsername
        ? data.username?.toLowerCase() === expectedUsername.toLowerCase()
        : true;

      return {
        exists:   true,
        isPublic: true,
        postId:   data.id,
        platform: 'instagram',
        accountMatch,
        metadata: { mediaType: data.media_type, timestamp: data.timestamp },
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return this.failedResult('instagram');
      }
      throw err;
    }
  }

  // ── TIKTOK CONTENT API ────────────────────────────────────
  private async verifyTikTokPost(
    postUrl: string,
    expectedUsername?: string,
  ): Promise<PostVerificationResult> {
    const videoId = this.extractTikTokId(postUrl);
    if (!videoId) return this.failedResult('tiktok');

    const clientKey    = this.config.get('TIKTOK_CLIENT_ID');
    const clientSecret = this.config.get('TIKTOK_CLIENT_SECRET');

    // Get client credentials token
    const { data: tokenRes } = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key:    clientKey,
        client_secret: clientSecret,
        grant_type:    'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const { data } = await axios.get(
      'https://open.tiktokapis.com/v2/video/query/',
      {
        params: {
          fields: 'id,create_time,share_url,embed_html',
        },
        data:    { filters: { video_ids: [videoId] } },
        headers: { Authorization: `Bearer ${tokenRes.access_token}` },
        timeout: 8000,
      },
    );

    const video = data?.data?.videos?.[0];
    if (!video) return this.failedResult('tiktok');

    return {
      exists:   true,
      isPublic: true,
      postId:   video.id,
      platform: 'tiktok',
      accountMatch: true,
      metadata: { createTime: video.create_time },
    };
  }

  // ── YOUTUBE DATA API ──────────────────────────────────────
  private async verifyYouTubePost(
    postUrl: string,
    expectedUsername?: string,
  ): Promise<PostVerificationResult> {
    const videoId = this.extractYouTubeId(postUrl);
    if (!videoId) return this.failedResult('youtube');

    const apiKey = this.config.get('YOUTUBE_API_KEY');

    const { data } = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          id:   videoId,
          part: 'snippet,status',
          key:  apiKey,
        },
        timeout: 8000,
      },
    );

    const video = data?.items?.[0];
    if (!video) return this.failedResult('youtube');

    const isPublic   = video.status?.privacyStatus === 'public';
    const channelName = video.snippet?.channelTitle ?? '';
    const accountMatch = expectedUsername
      ? channelName.toLowerCase().includes(expectedUsername.toLowerCase())
      : true;

    return {
      exists:   true,
      isPublic,
      postId:   videoId,
      platform: 'youtube',
      accountMatch,
      metadata: {
        title:       video.snippet?.title,
        channelTitle: channelName,
        publishedAt: video.snippet?.publishedAt,
      },
    };
  }

  // ── GENERIC FALLBACK (Facebook etc.) ─────────────────────
  private async verifyGenericPost(postUrl: string, platform: string): Promise<PostVerificationResult> {
    // Basic HTTP check — if URL is reachable, mark as exists
    try {
      const res = await axios.head(postUrl, { timeout: 6000 });
      return {
        exists:      res.status < 400,
        isPublic:    res.status < 400,
        postId:      null,
        platform,
        accountMatch: true,
      };
    } catch {
      return this.failedResult(platform);
    }
  }

  // ── CHECK IF POST STILL EXISTS (timer expiry check) ───────
  async checkPostStillLive(
    postUrl: string,
    platform: string,
    postId?: string | null,
    expectedUsername?: string,
  ): Promise<boolean> {
    const result = await this.verifyPost(postUrl, platform, expectedUsername);
    return result.exists && result.isPublic;
  }

  // ── GET CONNECTED ACCOUNTS ────────────────────────────────
  async getConnectedAccounts(creatorId: string) {
    return this.prisma.socialAccount.findMany({
      where:   { creatorId },
      orderBy: { followers: 'desc' },
    });
  }

  // ── DISCONNECT ACCOUNT ────────────────────────────────────
  async disconnectAccount(creatorId: string, accountId: string) {
    const account = await this.prisma.socialAccount.findFirst({
      where: { id: accountId, creatorId },
    });
    if (!account) throw new NotFoundException('Account not found');
    await this.prisma.socialAccount.delete({ where: { id: accountId } });
    return { disconnected: true };
  }

  // ── URL PARSERS ───────────────────────────────────────────
  private extractInstagramId(url: string): string | null {
    const m = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    return m?.[1] ?? null;
  }

  private extractTikTokId(url: string): string | null {
    const m = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    return m?.[1] ?? null;
  }

  private extractYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]+)/);
    return m?.[1] ?? null;
  }

  private failedResult(platform: string): PostVerificationResult {
    return { exists: false, isPublic: false, postId: null, platform, accountMatch: false };
  }
}
