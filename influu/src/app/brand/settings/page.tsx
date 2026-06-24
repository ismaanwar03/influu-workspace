'use client'
import { usersApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function BrandSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    usersApi
      .getBrandProfile()
      .then((res) => {
        const p = res.data as any
        reset({
          companyName: p.companyName || '',
          industry: p.industry || '',
          website: p.website || '',
        })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setFetching(false))
  }, [reset])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await usersApi.updateBrandProfile(data)
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (fetching)
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-6 h-6 border-2 border-brand rounded-full animate-spin border-t-transparent' />
      </div>
    )

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-text-primary'>Settings</h1>
        <p className='text-text-muted text-sm mt-1'>
          Update your brand profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div
          className='rounded-2xl p-6 space-y-4'
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h2 className='text-text-primary font-semibold'>Company Info</h2>

          <div>
            <label className='block text-sm text-text-secondary mb-1'>
              Company Name
            </label>
            <input
              {...register('companyName')}
              placeholder='Your company name'
              className='w-full rounded-xl px-4 py-3 text-sm text-text-primary'
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>

          <div>
            <label className='block text-sm text-text-secondary mb-1'>
              Industry
            </label>
            <input
              {...register('industry')}
              placeholder='e.g. Fashion, Tech, FMCG'
              className='w-full rounded-xl px-4 py-3 text-sm text-text-primary'
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>

          <div>
            <label className='block text-sm text-text-secondary mb-1'>
              Website
            </label>
            <input
              {...register('website')}
              placeholder='https://yourcompany.com'
              className='w-full rounded-xl px-4 py-3 text-sm text-text-primary'
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 rounded-xl font-semibold text-white transition-all'
          style={{ background: loading ? 'rgba(124,58,255,0.5)' : '#7C3AFF' }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
