'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card mb-6">
          <span className="text-xs font-medium text-primary">✨ Powered by AI</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Your Thoughts,
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {' '}Intelligently Organized
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
          Capture, organize, and explore your ideas with voice input, markdown editing, and AI-powered insights. Your second brain, now smarter than ever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/login">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-12 border-t border-border">
          {[
            { label: 'Voice Input', icon: '🎙️' },
            { label: 'AI Research', icon: '🔬' },
            { label: 'Markdown Editor', icon: '✍️' },
            { label: 'Kanban Boards', icon: '📋' },
          ].map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
