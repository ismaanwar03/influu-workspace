import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import 'dotenv/config' // Ensure environment variables are loaded explicitly
import { Pool } from 'pg'

// 1. Initialize the PostgreSQL connection pool matching your layout
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// 2. Pass the driver adapter directly to PrismaClient
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Influu.pk database…')
  const HASH = await bcrypt.hash('Password123!', 12)

  // ── BRANDS ──────────────────────────────────────────────────
  const brandUsers = [
    {
      name: 'Ahmed Khan',
      email: 'ahmed@khaadi.pk',
      company: 'Khaadi',
      industry: 'Fashion & Clothing',
    },
    {
      name: 'Fatima Syed',
      email: 'fatima@daraz.pk',
      company: 'Daraz PK',
      industry: 'Technology',
    },
    {
      name: 'Zain Malik',
      email: 'zain@foodpanda.pk',
      company: 'Foodpanda PK',
      industry: 'Food & Beverages',
    },
  ]

  for (const b of brandUsers) {
    await prisma.user.upsert({
      where: { email: b.email },
      update: {},
      create: {
        name: b.name,
        email: b.email,
        password: HASH,
        role: 'brand',
        isVerified: true,
        brandProfile: {
          create: { companyName: b.company, industry: b.industry, rating: 4.5 },
        },
      },
    })
    console.log(`  ✅ Brand: ${b.company}`)
  }

  // ── CREATORS ─────────────────────────────────────────────────
  const creators = [
    {
      name: 'Sara Malik',
      email: 'sara@creator.pk',
      niche: 'Fashion',
      city: 'Karachi',
      platform: 'instagram',
      username: 'saramalikkk',
      followers: 28000,
      eng: 5.1,
    },
    {
      name: 'Bilal Ahmed',
      email: 'bilal@creator.pk',
      niche: 'Food',
      city: 'Lahore',
      platform: 'tiktok',
      username: 'bilalahmedd',
      followers: 120000,
      eng: 6.8,
    },
    {
      name: 'Amna Khalid',
      email: 'amna@creator.pk',
      niche: 'Fashion',
      city: 'Lahore',
      platform: 'instagram',
      username: 'amnakhalid',
      followers: 45000,
      eng: 4.2,
    },
    {
      name: 'Hassan Raza',
      email: 'hassan@creator.pk',
      niche: 'Technology',
      city: 'Karachi',
      platform: 'youtube',
      username: 'hassanraza',
      followers: 89000,
      eng: 3.9,
    },
    {
      name: 'Usman Tariq',
      email: 'usman@creator.pk',
      niche: 'Fitness',
      city: 'Karachi',
      platform: 'tiktok',
      username: 'usmantariqfit',
      followers: 33000,
      eng: 7.2,
    },
  ]

  for (const c of creators) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        password: HASH,
        role: 'creator',
        isVerified: true,
        creatorProfile: {
          create: {
            bio: `${c.niche} creator based in ${c.city}`,
            niche: c.niche,
            city: c.city,
            rating: 4.8,
            totalDeals: Math.floor(Math.random() * 20) + 5,
            availability: 'available',
            socialAccounts: {
              create: {
                platform: c.platform as any,
                username: c.username,
                platformUserId: `uid_${c.username}`,
                followers: c.followers,
                engagementRate: c.eng,
                isVerified: true,
              },
            },
            packages: {
              create:
                c.platform === 'instagram'
                  ? [
                      {
                        title: 'Instagram Story',
                        platform: 'instagram' as any,
                        contentType: 'story' as any,
                        price: 3000,
                        deliveryDays: 1,
                      },
                      {
                        title: 'Instagram Reel',
                        platform: 'instagram' as any,
                        contentType: 'reel' as any,
                        price: 8000,
                        deliveryDays: 5,
                      },
                    ]
                  : c.platform === 'tiktok'
                    ? [
                        {
                          title: 'TikTok Video',
                          platform: 'tiktok' as any,
                          contentType: 'video' as any,
                          price: 6000,
                          deliveryDays: 5,
                        },
                      ]
                    : [
                        {
                          title: 'YouTube Video',
                          platform: 'youtube' as any,
                          contentType: 'video' as any,
                          price: 22000,
                          deliveryDays: 7,
                        },
                      ],
            },
          },
        },
      },
    })
    console.log(`  ✅ Creator: ${c.name} (@${c.username})`)
  }

  // ── PLATFORM SETTINGS ─────────────────────────────────────
  const settings = [
    { key: 'platform_fee_percent', value: '8' },
    { key: 'story_release_hours', value: '24' },
    { key: 'post_release_days', value: '7' },
    { key: 'draft_auto_approve_hours', value: '48' },
    { key: 'min_payout_amount', value: '500' },
    { key: 'max_revisions_allowed', value: '3' },
  ]

  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log('  ✅ Platform settings seeded')

  console.log('✅ Seed complete!')
  console.log('')
  console.log('Test accounts (password: Password123!):')
  console.log('  Brand:   ahmed@khaadi.pk')
  console.log('  Creator: sara@creator.pk')
}

main()
  .catch(console.error)
  .finally(async () => {
    // End the pool gracefully when completed
    await pool.end()
  })
