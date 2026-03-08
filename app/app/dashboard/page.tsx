'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RecentNotesWidget, RemindersWidget, TodosWidget, StatsWidget } from '@/components/app/dashboard-widgets'
import { CaptureThoughtsModal } from '@/components/app/capture-thoughts-modal'
import { Plus, Zap, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [captureOpen, setCaptureOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/research">
            <Button variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Research
            </Button>
          </Link>
          <Link href="/app/notes">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </Link>
        </div>
      </div>

      {/* Capture Thoughts Section */}
      <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              Tell Me Your Thoughts
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Write whatever's on your mind. I'll organize it into notes, reminders, or tasks.
            </p>
          </div>
          <Button
            onClick={() => setCaptureOpen(true)}
            className="gap-2"
            size="lg"
          >
            <MessageCircle className="w-4 h-4" />
            Capture
          </Button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <StatsWidget />
        </div>
        <div className="lg:col-span-1">
          <RecentNotesWidget />
        </div>
        <div className="lg:col-span-1">
          <RemindersWidget />
        </div>
        <div className="lg:col-span-1">
          <TodosWidget />
        </div>
      </div>

      {/* Capture Modal */}
      <CaptureThoughtsModal open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  )
}
