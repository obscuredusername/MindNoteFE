import { User, Bot, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { useRef, useEffect } from 'react'
import { SuggestionCard } from './SuggestionCard'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    suggestion?: string
    suggestion_data?: any
}

interface MessageListProps {
    messages: Message[]
    isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                            }`}>
                            {msg.role === 'user'
                                ? <User className="w-4 h-4 text-primary-foreground" />
                                : <Bot className="w-4 h-4 text-accent-foreground" />
                            }
                        </div>
                        <div className={`space-y-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-card border border-accent/10 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-muted-foreground/60 px-2 flex items-center gap-1">
                                {msg.timestamp && format(new Date(msg.timestamp), 'h:mm a')}
                            </span>

                            {msg.suggestion && msg.suggestion !== 'none' && (
                                <SuggestionCard
                                    suggestion={msg.suggestion}
                                    suggestionData={msg.suggestion_data}
                                />
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <Bot className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div className="bg-card border border-accent/10 p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        </div>
                    </div>
                )}

                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    )
}
