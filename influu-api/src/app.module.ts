import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { CampaignsModule } from './campaigns/campaigns.module'
import { ContractsModule } from './contracts/contracts.module'
import { EscrowModule } from './escrow/escrow.module'
import { NotificationsModule } from './notifications/notifications.module'
import { PrismaModule } from './prisma/prisma.module'
import { SocialModule } from './social/social.module'
import { UsersModule } from './users/users.module'
import { WebhooksModule } from './webhooks/webhooks.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    CampaignsModule,
    ContractsModule,
    EscrowModule,
    SocialModule,
    NotificationsModule,
    WebhooksModule,
    AdminModule,
  ],
})
export class AppModule {}
