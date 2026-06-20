# Influu.pk — Creator Escrow Platform

Pakistan's first influencer-brand escrow marketplace.

## Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TypeScript
- **State:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Payments:** Paymob (JazzCash, EasyPaisa, Cards)
- **Social Verification:** Phyllo API + native APIs
- **Automation:** Make.com + Bull Queue
- **Email:** Resend
- **Files:** Cloudinary

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login & signup
│   ├── (onboarding)/       # Brand & creator setup
│   ├── brand/              # Brand dashboard, campaigns, contracts, payments
│   └── creator/            # Creator dashboard, browse, packages, contracts
├── components/
│   ├── auth/               # Login, Signup pages
│   ├── brand/              # All brand screens
│   ├── creator/            # All creator screens
│   ├── layout/             # Sidebar, TopBar, AppShell, Logo
│   ├── onboarding/         # Brand & creator onboarding wizards
│   ├── shared/             # StatCard, EscrowPipeline
│   └── ui/                 # Button, Input, Card, Badge, Avatar, Modal
├── hooks/                  # useAuth, useContracts, useCampaigns
├── lib/                    # api.ts, utils.ts, constants.ts, validations.ts
├── stores/                 # auth.store.ts, ui.store.ts (Zustand)
└── types/                  # index.ts — all TypeScript types
```

## Key Flows

1. **Brand posts campaign** → Creators apply → Contract signed → Escrow locked
2. **Creator submits draft** → Brand reviews → Approve / Request revision (max N)
3. **Creator posts live** → Submits URL → API verification → Timer starts
4. **Timer expires** → Post re-verified → Payment auto-released via Paymob

## Next Steps

- [ ] Backend: NestJS + PostgreSQL + Prisma (see backend repo)
- [ ] Paymob payment integration
- [ ] Phyllo social account connection
- [ ] Make.com automation scenarios
- [ ] Socket.io real-time chat
- [ ] PDF contract generation
