'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Send, Sparkles, Loader2 } from 'lucide-react'
import { aiService, type ResearchResult } from '@/services/ai.service'

export default function ResearchPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ResearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)
    try {
      const data = await aiService.research(query)
      setResults(data)
    } catch (error) {
      console.error('Research error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
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
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()} className="w-full gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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

      {/* No Results */}
      {hasSearched && results.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No results found. Try a different query.</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!hasSearched && (
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
