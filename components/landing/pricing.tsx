'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for personal use',
    price: 'Free',
    features: [
      'Up to 100 notes',
      'Basic voice input',
      'Markdown editor',
      'Search functionality',
    ],
  },
  {
    name: 'Pro',
    description: 'For serious note-takers',
    price: '$9',
    period: '/month',
    featured: true,
    features: [
      'Unlimited notes',
      'Advanced voice input',
      'Full markdown support',
      'AI research mode',
      'Kanban boards',
      'Priority support',
    ],
  },
  {
    name: 'Team',
    description: 'Collaborate with your team',
    price: '$24',
    period: '/month per user',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Shared workspaces',
      'Admin controls',
      'Advanced analytics',
      'Dedicated support',
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-20 sm:py-32 bg-background/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose the perfect plan for your needs. Always flexible to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.featured ? 'border-primary ring-1 ring-primary/20' : 'border-border'
              }`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/app/dashboard" className="w-full">
                  <Button
                    variant={plan.featured ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
