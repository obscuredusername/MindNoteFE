'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, BookOpen, Grid3X3, Search, Settings, Zap } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Voice Capture',
    description: 'Quickly dictate your thoughts with smart voice recognition and real-time transcription.',
  },
  {
    icon: BookOpen,
    title: 'Intelligent Notes',
    description: 'Full markdown support with AI-powered formatting suggestions and auto-organization.',
  },
  {
    icon: Grid3X3,
    title: 'Kanban Boards',
    description: 'Visual task management with drag-and-drop boards for organizing your projects.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find anything instantly with semantic search powered by AI understanding.',
  },
  {
    icon: Zap,
    title: 'Research Mode',
    description: 'Deep dive into topics with AI-powered research and content generation.',
  },
  {
    icon: Settings,
    title: 'Fully Customizable',
    description: 'Dark mode, reminders, tags, and more. Build your perfect note-taking setup.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Powerful features designed to help you capture, organize, and understand your thoughts better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
