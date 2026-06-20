# Influu API — NestJS Backend

Pakistan's first creator escrow platform backend.

## Stack
- **Framework:** NestJS 10
- **Database:** PostgreSQL + Prisma ORM
- **Cache/Queue:** Redis + Bull
- **Auth:** JWT (access + refresh tokens) + Passport
- **Payments:** Paymob (JazzCash, EasyPaisa, Cards)
- **Social Verification:** Phyllo + Instagram Graph + TikTok Content API + YouTube Data API
- **Email:** Resend
- **Automation:** Make.com webhooks
- **Scheduler:** @nestjs/schedule (Cron jobs for timers)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env .env.local
# Edit .env with your database URL and API keys

# 3. Run PostgreSQL and Redis (via Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=influu_db postgres:15
docker run -d -p 6379:6379 redis:7

# 4. Push schema + seed
npm run prisma:push
npm run prisma:seed

# 5. Start dev server
npm run start:dev
```

API: http://localhost:4000/api/v1
Swagger: http://localhost:4000/api/docs

## Module Architecture

```
src/
├── auth/            JWT auth, signup, login, refresh, guards
├── users/           Brand profile, creator profile, packages, creator search
├── campaigns/       Campaign CRUD, brand campaigns, public listing
├── contracts/       Contract creation, signing, draft flow, post URL submission
├── escrow/          Paymob integration, timer cron jobs, payment release, refunds
├── social/          Phyllo sync, Instagram Graph, TikTok Content, YouTube Data API
├── notifications/   In-app notification CRUD with typed helpers
├── webhooks/        Make.com triggers, Paymob/Phyllo incoming webhooks
├── admin/           Dispute resolution, moderation queue, platform stats
└── common/
    ├── decorators/  @CurrentUser, @Roles, @Public
    ├── guards/      JwtAuthGuard, RolesGuard
    ├── filters/     GlobalExceptionFilter
    └── interceptors/ ResponseInterceptor
```

## Contract Flow

```
POST /api/v1/contracts                  → Create offer
POST /api/v1/contracts/:id/sign         → Both parties sign
POST /api/v1/payments/intent            → Lock funds in escrow (Paymob)
POST /api/v1/contracts/:id/drafts       → Creator submits draft
POST /api/v1/contracts/:id/drafts/:draftId/review → Brand approves or requests revision
POST /api/v1/contracts/:id/post-url    → Creator submits live post URL
POST /api/v1/social/verify-post        → API verifies post is live
CRON (every hour)                      → Check expired timers → release payment
```

## Environment Variables

See `.env` file for all required variables including:
- `DATABASE_URL`, `REDIS_URL`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID`, `PAYMOB_HMAC_SECRET`
- `PHYLLO_CLIENT_ID`, `PHYLLO_CLIENT_SECRET`
- `INSTAGRAM_APP_ID`, `TIKTOK_CLIENT_ID`, `YOUTUBE_API_KEY`
- `RESEND_API_KEY`
- `MAKE_WEBHOOK_*` URLs

## Test Accounts (after seed)

| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Brand   | ahmed@khaadi.pk        | Password123!  |
| Creator | sara@creator.pk        | Password123!  |
| Creator | bilal@creator.pk       | Password123!  |
