import LandingPage from '@/components/marketing/LandingPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Influu.pk — Get paid when you post',
  description:
    "Pakistan's first creator-brand escrow marketplace. Payment held securely, released automatically once your content goes live.",
}

export default function Home() {
  return <LandingPage />
}
