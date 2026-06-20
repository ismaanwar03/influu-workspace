'use client'
import Logo from '@/components/layout/Logo'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ROUTES } from '@/lib/constants'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const testimonial = {
  quote:
    'Finally a platform where my payment is guaranteed before I even start creating. Got paid within 24 hours of posting.',
  name: 'Amna Khalid',
  sub: 'Creator · 45K followers · Lahore',
  rating: 5,
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  // 🚀 FIXED: Connected directly to your active NestJS port 4000 server instance with role-based routing
  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password }),
        },
      )

      const json = await res.json()

      if (!res.ok) {
        toast.error(json?.message || 'Invalid email or password')
        return
      }

      const { user, tokens } = json

      if (!user || !tokens) {
        toast.error('Malformed API response payload layout.')
        return
      }

      // Store tokens and profiles securely in local memory
      localStorage.setItem('access_token', tokens.accessToken)
      localStorage.setItem('refresh_token', tokens.refreshToken)
      localStorage.setItem('user_role', user.role)
      localStorage.setItem('user_name', user.name)

      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`)

      // Dynamic redirect based on actual user role from the database
      if (user.role === 'brand') {
        router.push(ROUTES.brand.dashboard)
      } else if (user.role === 'creator') {
        router.push(ROUTES.creator.dashboard)
      } else if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/login')
      }
    } catch (err) {
      toast.error('Could not connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen grid'
      style={{ gridTemplateColumns: '1fr 1fr' }}
    >
      {/* Left — brand panel */}
      <div
        className='relative flex flex-col justify-between p-12 overflow-hidden'
        style={{ background: '#0C0C1A' }}
      >
        <div
          className='absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none'
          style={{
            background:
              'radial-gradient(circle,rgba(124,58,255,.18),transparent 70%)',
          }}
        />
        <div
          className='absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none'
          style={{
            background:
              'radial-gradient(circle,rgba(219,39,119,.12),transparent 70%)',
          }}
        />

        <Logo />

        <div className='relative z-10'>
          <h2 className='text-3xl font-extrabold text-text-primary leading-tight mb-4 tracking-tight'>
            Pakistan's most trusted creator payment platform.
          </h2>
          <p className='text-text-muted text-[15px] leading-relaxed mb-8'>
            Escrow-backed deals between brands and creators. No more chasing
            payments.
          </p>

          <div
            className='rounded-2xl p-5'
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className='text-text-secondary text-[13px] leading-relaxed italic mb-4'>
              "{testimonial.quote}"
            </p>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0'
                  style={{
                    background: 'rgba(124,58,255,.25)',
                    color: '#9F5FFF',
                  }}
                >
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className='text-[13px] font-semibold text-text-primary'>
                    {testimonial.name}
                  </div>
                  <div className='text-[11px] text-text-muted'>
                    {testimonial.sub}
                  </div>
                </div>
              </div>
              <div className='flex gap-0.5'>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={12} fill='#F59E0B' color='#F59E0B' />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-10 relative z-10'>
          {[
            ['₹50M+', 'Secured in escrow'],
            ['500+', 'Active creators'],
            ['200+', 'Brands onboarded'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className='text-xl font-extrabold text-text-primary tracking-tight'>
                {v}
              </div>
              <div className='text-[11px] text-text-muted font-medium'>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div
        className='flex items-center justify-center p-10'
        style={{ background: '#07070F' }}
      >
        <div className='w-full max-w-[380px]'>
          <h2 className='text-[26px] font-extrabold text-text-primary mb-1.5 tracking-tight'>
            Welcome back
          </h2>
          <p className='text-text-secondary text-sm mb-8'>
            Sign in to your Influu.pk account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Input
              label='Email address'
              type='email'
              placeholder='you@company.pk'
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input
                label='Password'
                type='password'
                placeholder='Your password'
                error={errors.password?.message}
                {...register('password')}
              />
              <div className='text-right mt-1.5'>
                <button
                  type='button'
                  className='text-[13px] text-brand-light font-medium hover:text-brand transition-colors'
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type='submit'
              fullWidth
              loading={loading}
              size='lg'
              style={
                {
                  marginTop: '8px',
                  background: '#12111F',
                  border: '1px solid rgba(255,255,255,0.1)',
                } as React.CSSProperties
              }
            >
              Sign in
            </Button>
          </form>

          <div className='relative my-6 flex items-center'>
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
            <Globe size={16} color='#4285F4' />
            Continue with Google
          </button>

          <p className='text-center text-text-secondary text-[13px] mt-6'>
            No account?{' '}
            <Link
              href={ROUTES.signup}
              className='text-brand-light font-semibold hover:text-brand transition-colors'
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
