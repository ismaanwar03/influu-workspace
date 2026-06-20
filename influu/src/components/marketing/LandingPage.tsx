'use client'

import Logo from '@/components/layout/Logo'
import { ROUTES } from '@/lib/constants'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  DollarSign,
  FileText,
  Lock,
  Quote,
  Shield,
  Star,
  Upload,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ───────────────────────── helpers ───────────────────────── */

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

function useCountUp(end: number, start: boolean, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf: number
    let startTime: number | null = null
    const step = (ts: number) => {
      if (startTime === null) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setValue(Math.floor(progress * end))
      if (progress < 1) raf = requestAnimationFrame(step)
      else setValue(end)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start, end, duration])
  return value
}

/* ───────────────────────── data ───────────────────────── */

const STATS = [
  {
    icon: <Briefcase size={20} />,
    end: 200,
    suffix: '+',
    prefix: '',
    label: 'Brands onboarded',
    color: '#7C3AFF',
  },
  {
    icon: <Users size={20} />,
    end: 500,
    suffix: '+',
    prefix: '',
    label: 'Active creators',
    color: '#10D9A0',
  },
  {
    icon: <DollarSign size={20} />,
    end: 50,
    suffix: 'M+',
    prefix: '₹',
    label: 'Secured in escrow',
    color: '#DB2777',
  },
  {
    icon: <CheckCircle size={20} />,
    end: 1200,
    suffix: '+',
    prefix: '',
    label: 'Deals completed',
    color: '#F59E0B',
  },
]

const TRUST_BADGES = [
  { icon: <Lock size={15} />, label: 'Funds held in escrow' },
  { icon: <Shield size={15} />, label: 'Verified creators only' },
  { icon: <FileText size={15} />, label: 'Auto-generated contracts' },
  { icon: <BadgeCheck size={15} />, label: 'API-verified delivery' },
]

const STEPS = [
  {
    n: '01',
    title: 'Create & agree',
    color: '#7C3AFF',
    icon: <Briefcase size={22} />,
    desc: 'Brand posts a campaign or sends a direct offer. Both agree on terms and revision limits. Auto-contract generated and signed digitally.',
  },
  {
    n: '02',
    title: 'Draft → Approve → Post',
    color: '#DB2777',
    icon: <Upload size={22} />,
    desc: 'Creator submits draft. Brand approves (or requests up to N revisions). Only after approval does creator post live.',
  },
  {
    n: '03',
    title: 'Verified → Paid',
    color: '#10D9A0',
    icon: <DollarSign size={22} />,
    desc: 'Our system verifies the post via Instagram / TikTok / YouTube APIs. Escrow auto-releases. Story: 24h. Post or Reel: 7 days.',
  },
]

const COMPARISON = [
  {
    row: 'Payment timing',
    old: 'Pay upfront and hope, or chase invoices for weeks',
    influu: 'Locked in escrow before work starts, released automatically',
  },
  {
    row: 'Ghosting risk',
    old: 'Creators disappear after payment, brands delay after delivery',
    influu: 'Funds already secured — nobody can disappear',
  },
  {
    row: 'Contracts',
    old: 'Screenshots of WhatsApp chats, if anything at all',
    influu: 'Auto-generated and digitally signed for every deal',
  },
  {
    row: 'Verification',
    old: 'You just take their word for it',
    influu: 'API checks the post is actually live before payment',
  },
  {
    row: 'Disputes',
    old: 'No recourse, no protection, no moderator',
    influu: 'Built-in moderation & dispute resolution',
  },
  {
    row: 'Fees',
    old: 'Hidden agency markups of 20–40%',
    influu: 'Flat 8% — only on deals that complete successfully',
  },
]

const TESTIMONIALS = [
  {
    name: 'Amna Khalid',
    role: 'Creator · Fashion · 45K · Lahore',
    rating: 5,
    color: '#7C3AFF',
    quote:
      'Finally a platform where my payment is guaranteed before I even start creating. Got paid within 24 hours of posting.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Creator · Food · 120K · Lahore',
    rating: 5,
    color: '#10D9A0',
    quote:
      'I used to chase brands for payment for weeks. Now the money is already locked before I even film the video.',
  },
  {
    name: 'Ahmed Khan',
    role: 'Marketing Lead · Khaadi',
    rating: 5,
    color: '#F59E0B',
    quote:
      'We stopped worrying about creators disappearing after payment. Approve the draft, they post, the rest is automatic.',
  },
  {
    name: 'Fatima Syed',
    role: 'Growth Manager · Daraz PK',
    rating: 4,
    color: '#DB2777',
    quote:
      'The escrow system alone saved us from at least three bad deals in our very first month on the platform.',
  },
  {
    name: 'Sara Malik',
    role: 'Creator · Beauty · 28K · Karachi',
    rating: 5,
    color: '#F45B69',
    quote:
      'Knowing my revision limit upfront means no more endless back-and-forth with brands over tiny changes.',
  },
]

const FAQS = [
  {
    q: 'How does the escrow system actually work?',
    a: "When a brand and creator agree on a deal, the brand's payment moves into a secure escrow account before any content is created. The money stays locked — untouched by either side — until the content is posted live and verified. Only then is it released to the creator automatically.",
  },
  {
    q: "What happens if my draft isn't approved?",
    a: "Brands can request up to the number of revisions agreed in the contract (usually 1–3). You'll get specific feedback on what to change. If a brand doesn't respond within 48 hours, your draft is automatically approved so you're never left waiting indefinitely.",
  },
  {
    q: 'How fast do creators get paid?',
    a: 'It depends on content type. Stories release 24 hours after the post goes live. Posts, Reels, and videos release 7 days after going live — as long as the content stays posted and verified the whole time.',
  },
  {
    q: "What if a brand disappears after I've posted?",
    a: "It can't happen, because the brand's payment is already locked in escrow before you ever post anything. Once your content is verified live, the payment timer starts automatically — no chasing required.",
  },
  {
    q: 'What payment methods are supported?',
    a: 'Brands can pay via JazzCash, EasyPaisa, debit/credit card, or bank transfer through our payment partner Paymob. Creators receive payouts through the same local methods.',
  },
  {
    q: 'Are there any fees to join?',
    a: 'No. Creating an account is completely free for both brands and creators. Influu only takes an 8% platform fee, and only on deals that are successfully completed and paid out.',
  },
]

/* ───────────────────────── page ───────────────────────── */

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-bg'>
      <Nav />
      <Hero />
      <StatsBar />
      <TrustBadgesBar />
      <HowItWorks />
      <ForBrandsAndCreators />
      <ComparisonTable />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

/* ───────────────────────── nav ───────────────────────── */

function Nav() {
  return (
    <nav
      className='sticky top-0 z-50 border-b border-white/7 backdrop-blur-xl'
      style={{ background: 'rgba(7,7,15,0.85)' }}
    >
      <div className='max-w-[1200px] mx-auto px-7 h-16 flex items-center justify-between'>
        <Logo />
        <div className='hidden md:flex items-center gap-8'>
          <a
            href='#how-it-works'
            className='text-sm text-text-secondary hover:text-text-primary transition-colors'
          >
            How it works
          </a>
          <a
            href='#faq'
            className='text-sm text-text-secondary hover:text-text-primary transition-colors'
          >
            FAQ
          </a>
          <a
            href='#for-brands'
            className='text-sm text-text-secondary hover:text-text-primary transition-colors'
          >
            For brands
          </a>
          <a
            href='#for-brands'
            className='text-sm text-text-secondary hover:text-text-primary transition-colors'
          >
            For creators
          </a>
        </div>
        <div className='flex items-center gap-2.5'>
          <Link
            href={ROUTES.login}
            className='px-4 py-2 rounded-xl text-sm font-semibold text-text-primary border border-white/7 hover:border-white/15 transition-all'
          >
            Sign in
          </Link>
          <Link
            href={ROUTES.signup}
            className='px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-px'
            style={{
              background: 'linear-gradient(135deg,#7C3AFF,#DB2777)',
              boxShadow: '0 4px 20px rgba(124,58,255,0.35)',
            }}
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ───────────────────────── hero ───────────────────────── */

function Hero() {
  return (
    <section className='relative overflow-hidden'>
      <div
        className='absolute -top-48 -left-48 w-[560px] h-[560px] rounded-full pointer-events-none'
        style={{
          background:
            'radial-gradient(circle,rgba(124,58,255,.18),transparent 70%)',
        }}
      />
      <div
        className='absolute -top-24 -right-24 w-[460px] h-[460px] rounded-full pointer-events-none'
        style={{
          background:
            'radial-gradient(circle,rgba(219,39,119,.14),transparent 70%)',
        }}
      />

      <div className='max-w-[1200px] mx-auto px-7 pt-20 pb-16 md:pt-28 md:pb-24 relative z-10 grid md:grid-cols-2 gap-14 items-center'>
        <div>
          <div
            className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6'
            style={{
              background: 'rgba(124,58,255,.12)',
              border: '1px solid rgba(124,58,255,.3)',
            }}
          >
            <span
              className='w-1.5 h-1.5 rounded-full animate-pulse-dot'
              style={{ background: '#7C3AFF' }}
            />
            <span className='text-xs font-semibold text-brand-light'>
              Pakistan's first creator escrow platform
            </span>
          </div>

          <h1 className='text-[44px] md:text-[54px] font-extrabold leading-[1.1] tracking-tight text-text-primary mb-5'>
            Your payment is
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg,#7C3AFF,#DB2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              locked until you post.
            </span>
          </h1>

          <p className='text-text-secondary text-[17px] leading-relaxed mb-9 max-w-[460px]'>
            Influu holds brand payments in escrow and releases them
            automatically once your content is verified live. No more chasing.
            No more risk.
          </p>

          <div className='flex flex-wrap gap-3'>
            <Link
              href={ROUTES.signup}
              className='inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all hover:-translate-y-px'
              style={{
                background: 'linear-gradient(135deg,#7C3AFF,#DB2777)',
                boxShadow: '0 4px 20px rgba(124,58,255,.35)',
              }}
            >
              I'm a brand <ArrowRight size={16} />
            </Link>
            <Link
              href={ROUTES.signup}
              className='inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-bold text-text-primary border border-white/10 transition-all hover:-translate-y-px hover:border-white/20'
              style={{ background: 'rgba(255,255,255,.05)' }}
            >
              I'm a creator <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* hero visual card */}
        <div className='relative'>
          <div
            className='rounded-2xl p-5 border border-white/7'
            style={{
              background: 'rgba(255,255,255,.03)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 40px 80px rgba(0,0,0,.6)',
            }}
          >
            <div className='flex justify-between items-center mb-4'>
              <span className='text-sm font-bold text-text-primary'>
                Active deal
              </span>
              <span
                className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold'
                style={{ background: 'rgba(16,217,160,.15)', color: '#10D9A0' }}
              >
                <span
                  className='w-1.5 h-1.5 rounded-full animate-pulse-dot'
                  style={{ background: '#10D9A0' }}
                />
                Escrow active
              </span>
            </div>

            {/* pipeline */}
            <div className='flex items-center mb-4'>
              {['Agreed', 'Drafted', 'Approved', 'Posted', 'Paid'].map(
                (s, i) => {
                  const done = i < 3
                  return (
                    <div
                      key={s}
                      className='flex items-center'
                      style={{ flex: i < 4 ? 1 : 0 }}
                    >
                      <div className='flex flex-col items-center gap-1'>
                        <div
                          className='w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold'
                          style={{
                            background: done
                              ? '#10D9A0'
                              : 'rgba(255,255,255,.07)',
                            border: `2px solid ${done ? '#10D9A0' : 'rgba(255,255,255,.1)'}`,
                            color: done ? '#07070F' : '#4A4A66',
                          }}
                        >
                          {done ? '✓' : '·'}
                        </div>
                        <span
                          className='text-[9px] font-semibold whitespace-nowrap'
                          style={{ color: done ? '#10D9A0' : '#4A4A66' }}
                        >
                          {s}
                        </span>
                      </div>
                      {i < 4 && (
                        <div
                          className='flex-1 h-0.5 mx-1 mb-3.5 rounded'
                          style={{
                            background: done
                              ? 'rgba(16,217,160,.4)'
                              : 'rgba(255,255,255,.07)',
                          }}
                        />
                      )}
                    </div>
                  )
                },
              )}
            </div>

            <div className='rounded-xl p-3.5 mb-3 bg-bg-card'>
              <div className='flex justify-between items-center mb-2.5'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold'
                    style={{
                      background: 'rgba(124,58,255,.22)',
                      color: '#9F5FFF',
                    }}
                  >
                    K
                  </div>
                  <div>
                    <div className='text-[13px] font-bold text-text-primary'>
                      Khaadi
                    </div>
                    <div className='text-[11px] text-text-muted'>
                      Fashion brand
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div
                    className='text-[17px] font-extrabold'
                    style={{ color: '#10D9A0' }}
                  >
                    ₹12,000
                  </div>
                  <div className='text-[11px] text-text-muted'>in escrow</div>
                </div>
              </div>
              <div className='flex gap-1.5'>
                {['Instagram', 'Reel', '7-day timer'].map((t) => (
                  <span
                    key={t}
                    className='text-[11px] font-semibold px-2 py-0.5 rounded-full'
                    style={{
                      background: 'rgba(124,58,255,.12)',
                      color: '#9F5FFF',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div
              className='flex items-center gap-2 px-3.5 py-2.5 rounded-xl'
              style={{
                background: 'rgba(16,217,160,.08)',
                border: '1px solid rgba(16,217,160,.2)',
              }}
            >
              <Lock size={13} color='#10D9A0' />
              <span
                className='text-[13px] font-semibold'
                style={{ color: '#10D9A0' }}
              >
                ₹12,000 locked · releases when post is verified
              </span>
            </div>
          </div>

          {/* floating badge */}
          <div
            className='absolute -top-4 -right-4 hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/7'
            style={{
              background: '#161628',
              boxShadow: '0 12px 40px rgba(0,0,0,.5)',
            }}
          >
            <CheckCircle size={16} color='#10D9A0' />
            <div>
              <div className='text-[12px] font-bold text-text-primary'>
                Payment released!
              </div>
              <div className='text-[11px] text-text-muted'>
                Post verified · just now
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── stats counter bar ───────────────────────── */

function StatsBar() {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <section ref={ref} className='border-y border-white/7 bg-bg-side'>
      <div className='max-w-[1200px] mx-auto px-7 py-10 grid grid-cols-2 md:grid-cols-4 gap-7'>
        {STATS.map((s) => (
          <StatCounter key={s.label} {...s} start={inView} />
        ))}
      </div>
    </section>
  )
}

function StatCounter({
  icon,
  end,
  suffix,
  prefix,
  label,
  color,
  start,
}: {
  icon: React.ReactNode
  end: number
  suffix: string
  prefix: string
  label: string
  color: string
  start: boolean
}) {
  const value = useCountUp(end, start)
  return (
    <div className='flex items-center gap-3.5'>
      <div
        className='w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0'
        style={{
          background: `${color}18`,
          border: `1px solid ${color}30`,
          color,
        }}
      >
        {icon}
      </div>
      <div>
        <div className='text-2xl font-extrabold text-text-primary tracking-tight'>
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </div>
        <div className='text-[12px] text-text-muted font-medium'>{label}</div>
      </div>
    </div>
  )
}

/* ───────────────────────── trust badges bar ───────────────────────── */

function TrustBadgesBar() {
  return (
    <section
      className='border-b border-white/7'
      style={{ background: 'rgba(124,58,255,.04)' }}
    >
      <div className='max-w-[1200px] mx-auto px-7 py-3.5 flex flex-wrap justify-center gap-x-8 gap-y-2'>
        {TRUST_BADGES.map((b) => (
          <div
            key={b.label}
            className='flex items-center gap-2 text-text-secondary text-[13px]'
          >
            <span style={{ color: '#9F5FFF' }}>{b.icon}</span>
            {b.label}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── how it works ───────────────────────── */

function HowItWorks() {
  return (
    <section
      id='how-it-works'
      className='max-w-[1200px] mx-auto px-7 py-20 md:py-24'
    >
      <div className='text-center mb-14'>
        <div
          className='text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5'
          style={{ color: '#9F5FFF' }}
        >
          The process
        </div>
        <h2 className='text-[34px] md:text-[38px] font-extrabold tracking-tight text-text-primary mb-3'>
          Three steps. Zero risk.
        </h2>
        <p className='text-text-secondary text-base max-w-[440px] mx-auto leading-relaxed'>
          From campaign creation to automatic payment. No manual intervention
          needed.
        </p>
      </div>

      <div className='grid md:grid-cols-3 rounded-2xl overflow-hidden border border-white/7'>
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className='p-8 bg-bg-card'
            style={{
              borderRight: i < 2 ? '1px solid rgba(255,255,255,.07)' : 'none',
            }}
          >
            <div className='flex justify-between items-start mb-5'>
              <div
                className='w-12 h-12 rounded-2xl flex items-center justify-center'
                style={{
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}30`,
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
              <span
                className='text-[42px] font-extrabold leading-none'
                style={{ color: `${s.color}12` }}
              >
                {s.n}
              </span>
            </div>
            <h3 className='text-[17px] font-extrabold text-text-primary mb-2.5 tracking-tight'>
              {s.title}
            </h3>
            <p className='text-text-secondary text-sm leading-relaxed'>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── for brands & creators ───────────────────────── */

function ForBrandsAndCreators() {
  return (
    <section
      id='for-brands'
      className='max-w-[1200px] mx-auto px-7 pb-20 md:pb-24'
    >
      <div className='grid md:grid-cols-2 gap-5'>
        {/* Brands */}
        <div
          className='rounded-3xl p-9'
          style={{
            background:
              'linear-gradient(145deg,rgba(124,58,255,.1),rgba(16,16,30,.4))',
            border: '1px solid rgba(124,58,255,.18)',
          }}
        >
          <div
            className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5'
            style={{
              background: 'rgba(124,58,255,.15)',
              border: '1px solid rgba(124,58,255,.3)',
            }}
          >
            <Briefcase size={12} color='#9F5FFF' />
            <span
              className='text-xs font-semibold'
              style={{ color: '#9F5FFF' }}
            >
              For brands
            </span>
          </div>
          <h3 className='text-2xl font-extrabold text-text-primary mb-3 leading-snug tracking-tight'>
            Stop losing money to influencers who never deliver
          </h3>
          <p className='text-text-secondary text-sm leading-relaxed mb-6'>
            Your payment stays locked until the post is verified live. Approve
            every draft before it goes public.
          </p>
          {[
            'Approve draft before it goes live',
            'Payment released only after API verification',
            'Auto-generated legal contract per deal',
            'Full refund if deadline missed',
          ].map((f) => (
            <div key={f} className='flex items-center gap-2.5 mb-2.5'>
              <div
                className='w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0'
                style={{
                  background: 'rgba(16,217,160,.15)',
                  border: '1px solid rgba(16,217,160,.3)',
                }}
              >
                <Check size={9} color='#10D9A0' />
              </div>
              <span className='text-text-secondary text-[13px]'>{f}</span>
            </div>
          ))}
          <Link
            href={ROUTES.signup}
            className='inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-px'
            style={{
              background: 'linear-gradient(135deg,#7C3AFF,#DB2777)',
              boxShadow: '0 4px 20px rgba(124,58,255,.35)',
            }}
          >
            Post a campaign <ArrowRight size={15} />
          </Link>
        </div>

        {/* Creators */}
        <div
          className='rounded-3xl p-9'
          style={{
            background:
              'linear-gradient(145deg,rgba(16,217,160,.07),rgba(16,16,30,.4))',
            border: '1px solid rgba(16,217,160,.16)',
          }}
        >
          <div
            className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5'
            style={{
              background: 'rgba(16,217,160,.12)',
              border: '1px solid rgba(16,217,160,.25)',
            }}
          >
            <Star size={12} color='#10D9A0' />
            <span
              className='text-xs font-semibold'
              style={{ color: '#10D9A0' }}
            >
              For creators
            </span>
          </div>
          <h3 className='text-2xl font-extrabold text-text-primary mb-3 leading-snug tracking-tight'>
            Your payment is guaranteed before you start creating
          </h3>
          <p className='text-text-secondary text-sm leading-relaxed mb-6'>
            Brand payment is locked the moment you accept a deal. Post it,
            submit the link, get paid automatically.
          </p>
          {[
            'Payment locked before you start creating',
            'Revision limit defined upfront',
            'Post live → Submit link → Get paid',
            'JazzCash, EasyPaisa & bank transfer',
          ].map((f) => (
            <div key={f} className='flex items-center gap-2.5 mb-2.5'>
              <div
                className='w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0'
                style={{
                  background: 'rgba(16,217,160,.15)',
                  border: '1px solid rgba(16,217,160,.3)',
                }}
              >
                <Check size={9} color='#10D9A0' />
              </div>
              <span className='text-text-secondary text-[13px]'>{f}</span>
            </div>
          ))}
          <Link
            href={ROUTES.signup}
            className='inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-px'
            style={{
              background: 'rgba(16,217,160,.12)',
              border: '1px solid rgba(16,217,160,.3)',
              color: '#10D9A0',
            }}
          >
            Join as creator <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── comparison table ───────────────────────── */

function ComparisonTable() {
  return (
    <section className='max-w-[1200px] mx-auto px-7 pb-20 md:pb-24'>
      <div className='text-center mb-12'>
        <div
          className='text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5'
          style={{ color: '#9F5FFF' }}
        >
          The difference
        </div>
        <h2 className='text-[34px] font-extrabold tracking-tight text-text-primary mb-3'>
          Influu vs. the old way
        </h2>
        <p className='text-text-secondary text-base max-w-[480px] mx-auto leading-relaxed'>
          Informal deals over DMs come with real risk. Here's what changes.
        </p>
      </div>

      <div className='rounded-2xl overflow-hidden border border-white/7'>
        <div className='grid grid-cols-[120px_1fr_1fr] md:grid-cols-[200px_1fr_1fr] bg-bg-card2'>
          <div className='p-4' />
          <div className='p-4 text-center text-sm font-bold text-text-muted'>
            The old way
          </div>
          <div
            className='p-4 text-center text-sm font-bold'
            style={{ color: '#10D9A0' }}
          >
            With Influu
          </div>
        </div>

        {COMPARISON.map((row) => (
          <div
            key={row.row}
            className='grid grid-cols-[120px_1fr_1fr] md:grid-cols-[200px_1fr_1fr] bg-bg-card'
            style={{ borderTop: '1px solid rgba(255,255,255,.07)' }}
          >
            <div className='p-4 flex items-center text-[13px] md:text-sm font-bold text-text-primary'>
              {row.row}
            </div>
            <div className='p-4 flex items-start gap-2 text-[12px] md:text-[13px] text-text-muted leading-relaxed'>
              <X size={14} color='#F45B69' className='mt-0.5 flex-shrink-0' />
              {row.old}
            </div>
            <div
              className='p-4 flex items-start gap-2 text-[12px] md:text-[13px] text-text-secondary leading-relaxed'
              style={{ background: 'rgba(16,217,160,.04)' }}
            >
              <Check
                size={14}
                color='#10D9A0'
                className='mt-0.5 flex-shrink-0'
              />
              {row.influu}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── testimonials carousel ───────────────────────── */

function Testimonials() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(
      () => setIdx((p) => (p + 1) % TESTIMONIALS.length),
      6000,
    )
    return () => clearInterval(t)
  }, [])

  const next = () => setIdx((p) => (p + 1) % TESTIMONIALS.length)
  const prev = () =>
    setIdx((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const item = TESTIMONIALS[idx]

  return (
    <section className='max-w-[1200px] mx-auto px-7 pb-20 md:pb-24'>
      <div className='text-center mb-12'>
        <div
          className='text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5'
          style={{ color: '#9F5FFF' }}
        >
          Trusted by both sides
        </div>
        <h2 className='text-[34px] font-extrabold tracking-tight text-text-primary'>
          What people are saying
        </h2>
      </div>

      <div className='max-w-[680px] mx-auto relative'>
        <div className='rounded-3xl p-9 md:p-11 border border-white/7 text-center bg-bg-card'>
          <Quote
            size={28}
            color={item.color}
            className='mx-auto mb-5 opacity-50'
          />
          <p className='text-text-primary text-lg md:text-xl leading-relaxed font-medium mb-7'>
            "{item.quote}"
          </p>
          <div className='flex justify-center gap-1 mb-4'>
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} size={14} fill='#F59E0B' color='#F59E0B' />
            ))}
          </div>
          <div className='flex items-center justify-center gap-3'>
            <div
              className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm'
              style={{ background: `${item.color}22`, color: item.color }}
            >
              {item.name[0]}
            </div>
            <div className='text-left'>
              <div className='text-sm font-bold text-text-primary'>
                {item.name}
              </div>
              <div className='text-xs text-text-muted'>{item.role}</div>
            </div>
          </div>
        </div>

        <button
          onClick={prev}
          aria-label='Previous testimonial'
          className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all bg-bg-card2'
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          aria-label='Next testimonial'
          className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all bg-bg-card2'
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className='flex justify-center gap-2 mt-7'>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className='h-1.5 rounded-full transition-all'
            style={{
              width: i === idx ? 24 : 8,
              background: i === idx ? '#9F5FFF' : 'rgba(255,255,255,.15)',
            }}
          />
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── FAQ accordion ───────────────────────── */

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id='faq' className='max-w-[760px] mx-auto px-7 pb-20 md:pb-24'>
      <div className='text-center mb-12'>
        <div
          className='text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5'
          style={{ color: '#9F5FFF' }}
        >
          Got questions?
        </div>
        <h2 className='text-[34px] font-extrabold tracking-tight text-text-primary'>
          Frequently asked questions
        </h2>
      </div>

      <div className='flex flex-col gap-3'>
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div
              key={f.q}
              className='rounded-2xl border border-white/7 overflow-hidden bg-bg-card'
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className='w-full flex items-center justify-between gap-4 px-6 py-5 text-left'
              >
                <span className='text-[15px] font-bold text-text-primary'>
                  {f.q}
                </span>
                <span className='flex-shrink-0 text-text-muted'>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              {isOpen && (
                <div className='px-6 pb-5 text-[14px] text-text-secondary leading-relaxed'>
                  {f.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────────────── final CTA ───────────────────────── */

function FinalCTA() {
  return (
    <section className='border-t border-white/7 py-20 md:py-24'>
      <div className='max-w-[600px] mx-auto px-7 text-center'>
        <h2 className='text-[36px] md:text-[42px] font-extrabold tracking-tight leading-tight mb-4 text-text-primary'>
          <span
            style={{
              background: 'linear-gradient(135deg,#7C3AFF,#DB2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Zero risk
          </span>{' '}
          deals for
          <br />
          Pakistani creators and brands.
        </h2>
        <p className='text-text-secondary text-base leading-relaxed mb-8'>
          Join the growing community of brands and creators who use Influu for
          every deal.
        </p>
        <Link
          href={ROUTES.signup}
          className='inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white transition-all hover:-translate-y-px'
          style={{
            background: 'linear-gradient(135deg,#7C3AFF,#DB2777)',
            boxShadow: '0 4px 20px rgba(124,58,255,.35)',
          }}
        >
          Get started — it's free <ArrowRight size={17} />
        </Link>
        <p className='text-text-muted text-xs mt-4'>
          No credit card required · 8% fee on completed deals only
        </p>
      </div>
    </section>
  )
}

/* ───────────────────────── footer ───────────────────────── */

function Footer() {
  return (
    <footer className='border-t border-white/7 py-6'>
      <div className='max-w-[1200px] mx-auto px-7 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <Logo size='sm' />
        <div className='flex gap-6'>
          {['Privacy', 'Terms', 'Support'].map((l) => (
            <button
              key={l}
              className='text-text-muted text-[13px] hover:text-text-secondary transition-colors'
            >
              {l}
            </button>
          ))}
        </div>
        <span className='text-text-muted text-[13px]'>© 2025 Influu.pk</span>
      </div>
    </footer>
  )
}
