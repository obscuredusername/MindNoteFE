import { HeroSection } from '@/components/landing/hero'
import { FeaturesSection } from '@/components/landing/features'
import { PricingSection } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: 'Mindnote - AI-Powered Note Taking',
  description: 'Capture, organize, and explore your thoughts with intelligent AI assistance. Voice input, markdown editing, kanban boards, and research mode.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
