'use client'
import Logo from '@/components/layout/Logo'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authApi } from '@/lib/api'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { signupSchema, type SignupInput } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Briefcase, Check, Globe, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const ROLES = [
  {
    id: 'brand' as const,
    icon: <Briefcase size={26} />,
    title: "I'm a brand",
    desc: 'Post campaigns, find creators, pay securely',
    color: '#7C3AFF',
  },
  {
    id: 'creator' as const,
    icon: <Star size={26} />,
    title: "I'm a creator",
    desc: 'Find brand deals, create content, get paid',
    color: '#10D9A0',
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<'brand' | 'creator' | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: undefined, terms: false },
  })

  const handleRoleSelect = (r: 'brand' | 'creator') => {
    setRole(r)
    setValue('role', r)
  }

  const onSubmit = async (data: SignupInput) => {
    setLoading(true)
    try {
      const res = await authApi.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      localStorage.setItem('access_token', res.data.data.tokens.accessToken)
      localStorage.setItem('refresh_token', res.data.data.tokens.refreshToken)
      toast.success('Account created!')
      router.push(
        data.role === 'brand'
          ? ROUTES.onboarding.brand
          : ROUTES.onboarding.creator,
      )
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center p-6 relative overflow-hidden'
      style={{ background: '#07070F' }}
    >
      {/* blobs */}
      <div
        className='absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full pointer-events-none'
        style={{
          background:
            'radial-gradient(circle,rgba(124,58,255,.12),transparent 70%)',
        }}
      />
      <div
        className='absolute -bottom-48 -left-48 w-[400px] h-[400px] rounded-full pointer-events-none'
        style={{
          background:
            'radial-gradient(circle,rgba(219,39,119,.08),transparent 70%)',
        }}
      />

      <div
        className={cn(
          'w-full relative z-10 animate-fade-up',
          step === 1 ? 'max-w-[560px]' : 'max-w-[420px]',
        )}
      >
        <div className='text-center mb-7'>
          <Logo />
        </div>

        {/* STEP 1 — Role selection */}
        {step === 1 && (
          <div>
            <h2 className='text-[28px] font-extrabold text-text-primary text-center mb-1.5 tracking-tight'>
              Join Influu.pk
            </h2>
            <p className='text-text-secondary text-sm text-center mb-7'>
              Choose your account type to get started
            </p>

            <div className='grid grid-cols-2 gap-3 mb-5'>
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id)}
                  className='relative rounded-[18px] p-7 text-center transition-all duration-150 cursor-pointer'
                  style={{
                    background: role === r.id ? `${r.color}10` : '#10101E',
                    border: `2px solid ${role === r.id ? r.color : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {role === r.id && (
                    <div
                      className='absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center'
                      style={{ background: r.color }}
                    >
                      <Check size={11} color='#fff' />
                    </div>
                  )}
                  <div
                    className='w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all'
                    style={{
                      background:
                        role === r.id
                          ? `${r.color}20`
                          : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${role === r.id ? r.color + '40' : 'rgba(255,255,255,0.07)'}`,
                      color: role === r.id ? r.color : '#8B8BAA',
                    }}
                  >
                    {r.icon}
                  </div>
                  <div className='font-bold text-[15px] text-text-primary mb-1.5'>
                    {r.title}
                  </div>
                  <div className='text-[12px] text-text-muted leading-relaxed'>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>

            <button
              disabled={!role}
              onClick={() => {
                if (role) setStep(2)
              }}
              className='w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all'
              style={{
                background: role
                  ? 'linear-gradient(135deg,#7C3AFF,#DB2777)'
                  : 'rgba(255,255,255,0.04)',
                border: role ? 'none' : '1px solid rgba(255,255,255,0.07)',
                color: role ? '#fff' : '#4A4A66',
                boxShadow: role ? '0 4px 20px rgba(124,58,255,0.35)' : 'none',
                cursor: role ? 'pointer' : 'not-allowed',
              }}
            >
              Continue as{' '}
              {role === 'brand'
                ? 'brand'
                : role === 'creator'
                  ? 'creator'
                  : '...'}
            </button>

            <p className='text-center text-text-secondary text-[13px] mt-5'>
              Have an account?{' '}
              <Link
                href={ROUTES.login}
                className='text-brand-light font-semibold hover:text-brand transition-colors'
              >
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 — Account details */}
        {step === 2 && (
          <div
            className='rounded-3xl p-8'
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <button
              onClick={() => setStep(1)}
              className='text-text-muted text-[13px] flex items-center gap-1.5 mb-5 hover:text-text-secondary transition-colors cursor-pointer'
              style={{ background: 'none', border: 'none' }}
            >
              ← Back
            </button>

            {/* Role badge */}
            <div
              className='flex items-center gap-3 mb-6 p-3 rounded-xl'
              style={{
                background: '#10101E',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                className='w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0'
                style={{
                  background:
                    role === 'brand'
                      ? 'rgba(124,58,255,.15)'
                      : 'rgba(16,217,160,.12)',
                  color: role === 'brand' ? '#7C3AFF' : '#10D9A0',
                }}
              >
                {role === 'brand' ? (
                  <Briefcase size={17} />
                ) : (
                  <Star size={17} />
                )}
              </div>
              <div>
                <div className='text-[14px] font-bold text-text-primary'>
                  {role === 'brand' ? 'Brand' : 'Creator'} account
                </div>
                <div className='text-[12px] text-text-muted'>
                  Free · 8% fee on completed deals only
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <Input
                label='Full name'
                type='text'
                placeholder='Ahmed Khan'
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label='Email address'
                type='email'
                placeholder='ahmed@company.pk'
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label='Password'
                type='password'
                placeholder='Min. 8 characters'
                error={errors.password?.message}
                {...register('password')}
              />

              <label className='flex items-start gap-2.5 cursor-pointer'>
                <input
                  type='checkbox'
                  {...register('terms')}
                  className='mt-0.5'
                  style={{ accentColor: '#7C3AFF' }}
                />
                <span className='text-[12px] text-text-muted leading-relaxed'>
                  I agree to the{' '}
                  <button
                    type='button'
                    className='text-brand-light font-semibold hover:text-brand transition-colors'
                  >
                    Terms
                  </button>{' '}
                  and{' '}
                  <button
                    type='button'
                    className='text-brand-light font-semibold hover:text-brand transition-colors'
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className='text-[11px] text-danger'>
                  {errors.terms.message}
                </p>
              )}

              <Button
                type='submit'
                fullWidth
                loading={loading}
                size='lg'
                icon={<ArrowRight size={15} />}
                iconPosition='right'
              >
                Create account
              </Button>
            </form>

            {/* Google */}
            <div className='relative my-5 flex items-center'>
              <div
                className='flex-1 h-px'
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
              <span className='px-3 text-[12px] text-text-muted'>or</span>
              <div
                className='flex-1 h-px'
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
            </div>
            <button
              className='w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-[14px] font-semibold text-text-primary transition-all hover:bg-white/5'
              style={{
                background: '#10101E',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Globe size={16} color='#4285F4' /> Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
