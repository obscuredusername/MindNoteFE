import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SuggestionCardProps {
    suggestion: string
    suggestionData?: {
        title?: string
        content?: string
    } | null
    onExecute: (suggestion: string, data: any) => void
}

export function SuggestionCard({ suggestion, suggestionData, onExecute }: SuggestionCardProps) {
    return (
        <div className="mt-6 p-5 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-3xl space-y-4 group transition-all hover:border-accent/50 hover:shadow-[0_0_30px_rgba(var(--accent),0.1)] max-w-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[11px] font-black text-accent uppercase tracking-[0.2em]">
                    <Sparkles className="w-4 h-4" />
                    AI PROMPT
                </div>
                <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/20 text-[10px] font-black text-accent uppercase">
                    {suggestion}
                </div>
            </div>

            {suggestionData && (
                <div className="space-y-2">
                    <p className="text-lg font-black text-foreground group-hover:text-accent transition-colors leading-tight tracking-tight">
                        {suggestionData.title}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                        {suggestionData.content}
                    </p>
                </div>
            )}

            <Button
                size="lg"
                className="w-full text-xs h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-black rounded-2xl shadow-xl shadow-accent/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px] active:scale-[0.97] border-none flex items-center justify-center gap-2"
                onClick={() => onExecute(suggestion, suggestionData)}
            >
                Add to {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}s
                <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    )
}
