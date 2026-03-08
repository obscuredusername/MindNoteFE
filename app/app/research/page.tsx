'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, Send, Sparkles } from 'lucide-react'

export default function ResearchPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{ title: string; content: string }[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          title: 'Understanding AI and Machine Learning',
          content:
            'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on the development of algorithms and statistical models that computers use to perform specific tasks.',
        },
        {
          title: 'Deep Learning Fundamentals',
          content:
            'Deep learning is a specialized subset of machine learning that uses artificial neural networks with multiple layers (hence "deep") to progressively extract higher-level features from raw input.',
        },
        {
          title: 'Natural Language Processing',
          content:
            'NLP is a branch of AI that helps computers understand, interpret, and generate human language in a meaningful and useful way. It combines computational linguistics and machine learning to process text and speech.',
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-8 h-8 text-accent" />
          Research Mode
        </h1>
        <p className="text-muted-foreground mt-1">Deep dive into topics with AI-powered research</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Start Your Research</CardTitle>
          <CardDescription>Ask anything and get comprehensive AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="What would you like to research? (e.g., 'AI trends in 2024')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading} className="w-full gap-2">
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Research
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Research Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{result.content}</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Save to Note
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {query && results.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No results found. Try a different query.</p>
          </CardContent>
        </Card>
      )}

      {!query && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Lightbulb className="w-12 h-12 text-accent/50 mx-auto" />
              <div>
                <h3 className="font-semibold text-foreground">Start Your Research</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Ask a question about any topic and get comprehensive AI-powered research results
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
