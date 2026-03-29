import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SuggestionCardProps {
    suggestion: string
    suggestionData?: {
        title?: string
        content?: string
    } | null
}

export function SuggestionCard({ suggestion, suggestionData }: SuggestionCardProps) {
    return (
        <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                AI Suggestion: {suggestion}
            </div>
            {suggestionData && (
                <div className="text-sm">
                    <p className="font-medium text-foreground">{suggestionData.title}</p>
                    <p className="text-muted-foreground text-xs line-clamp-2">{suggestionData.content}</p>
                </div>
            )}
            <Button size="sm" variant="outline" className="w-full text-xs h-8">
                Create {suggestion}
            </Button>
        </div>
    )
}
