import { User, Bot, Loader2 } from 'lucide-react'
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
    onExecuteSuggestion: (suggestion: string, data: any) => void
}

export function MessageList({ messages, isLoading, onExecuteSuggestion }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [messages, isLoading])

    return (
        <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 hover:scrollbar-thumb-accent/40 p-6 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center text-muted-foreground/30 py-20 italic text-sm">
                        No messages yet. Ask MindNote anything about your data.
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse animate-in slide-in-from-right-3 duration-500' : 'animate-in slide-in-from-left-3 duration-500'}`}
                    >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                            }`}>
                            {msg.role === 'user'
                                ? <User className="w-5 h-5 text-primary-foreground" />
                                : <Bot className="w-5 h-5 text-accent-foreground" />
                            }
                        </div>
                        <div className={`space-y-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl shadow-lg text-[15px] leading-relaxed tracking-tight ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-card border border-accent/20 rounded-tl-none font-medium text-foreground'
                                }`}>
                                {msg.content}
                            </div>
                            <span className={`text-[10px] text-muted-foreground/50 px-2 flex items-center gap-1 font-bold tracking-widest ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.timestamp && format(new Date(msg.timestamp), 'h:mm a')}
                            </span>

                            {msg.suggestion && msg.suggestion !== 'none' && (
                                <SuggestionCard
                                    suggestion={msg.suggestion}
                                    suggestionData={msg.suggestion_data}
                                    onExecute={onExecuteSuggestion}
                                />
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg">
                            <Bot className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div className="bg-card border border-accent/20 p-4 rounded-2xl rounded-tl-none shadow-lg">
                            <div className="flex gap-1.5 items-center h-5 px-1">
                                <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Anchor for scrollIntoView */}
                <div ref={scrollRef} className="h-4 w-full invisible" />
            </div>
        </div>
    )
}
