'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Send,
    Plus,
    MessageCircle,
    Trash2,
    MoreVertical,
    Loader2,
    Sparkles,
    User,
    Bot
} from 'lucide-react'
import { format } from 'date-fns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    suggestion?: 'notes' | 'reminder' | 'task'
    suggestion_data?: any
}

interface ChatSession {
    id: string
    title: string
    updated_at: string
}

export default function ChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchSessions()
    }, [])

    useEffect(() => {
        if (currentSessionId) {
            fetchMessages(currentSessionId)
        } else {
            setMessages([])
        }
    }, [currentSessionId])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const fetchSessions = async () => {
        try {
            const data = await api.get<ChatSession[]>('/chat/sessions')
            setSessions(data)
            if (data.length > 0 && !currentSessionId) {
                setCurrentSessionId(data[0].id)
            }
        } catch (error) {
            console.error('Error fetching sessions:', error)
        } finally {
            setIsInitialLoading(false)
        }
    }

    const fetchMessages = async (chatId: string) => {
        try {
            const data = await api.get<any>(`/chat/sessions/${chatId}`)
            setMessages(data.messages)
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    const startNewChat = async () => {
        try {
            const data = await api.post<any>('/chat/sessions', { title: 'New Chat' })
            setSessions([data, ...sessions])
            setCurrentSessionId(data.chat_id)
        } catch (error) {
            console.error('Error creating session:', error)
        }
    }

    const deleteSession = async (id: string) => {
        try {
            await api.delete(`/chat/sessions/${id}`)
            setSessions(sessions.filter(s => s.id !== id))
            if (currentSessionId === id) {
                setCurrentSessionId(null)
            }
        } catch (error) {
            console.error('Error deleting session:', error)
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || !currentSessionId || isLoading) return

        const userMsg = input
        setInput('')

        // Optimistic update
        const newMessage: Message = {
            role: 'user',
            content: userMsg,
            timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, newMessage])
        setIsLoading(true)

        try {
            const data = await api.post<any>(`/chat/sessions/${currentSessionId}/chat`, {
                message: userMsg
            })

            const assistantMsg: Message = {
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString(),
                suggestion: data.suggestion,
                suggestion_data: data.suggestion_data
            }

            setMessages(prev => [...prev, assistantMsg])

            // Update session title if it changed
            if (data.title) {
                setSessions(prev => prev.map(s =>
                    s.id === currentSessionId ? { ...s, title: data.title } : s
                ))
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden">
            {/* Sidebar - Sessions List */}
            <Card className="w-80 flex flex-col border-accent/20">
                <div className="p-4 border-b border-accent/10">
                    <Button
                        onClick={startNewChat}
                        className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => setCurrentSessionId(session.id)}
                                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${currentSessionId === session.id
                                        ? 'bg-accent/10 text-accent font-medium'
                                        : 'hover:bg-accent/5 text-muted-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <MessageCircle className={`w-4 h-4 flex-shrink-0 ${currentSessionId === session.id ? 'text-accent' : 'text-muted-foreground/50'}`} />
                                    <span className="text-sm truncate">{session.title}</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => deleteSession(session.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                        {sessions.length === 0 && !isInitialLoading && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No chats yet. Start one!
                            </div>
                        )}
                        {isInitialLoading && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-accent/50" />
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col border-accent/20 bg-gradient-to-b from-background to-accent/5">
                {!currentSessionId ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">MindNote AI Chat</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                Ask me about your notes, reminders, and tasks. I can help you organize and recall information effortlessly.
                            </p>
                        </div>
                        <Button onClick={startNewChat} variant="outline" className="mt-4">
                            Start Your First Conversation
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-accent-foreground" />}
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

                                            {/* Suggestion Card */}
                                            {msg.suggestion && msg.suggestion !== 'none' && (
                                                <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                                                        <Sparkles className="w-3 h-3" />
                                                        AI Suggestion: {msg.suggestion}
                                                    </div>
                                                    {msg.suggestion_data && (
                                                        <div className="text-sm">
                                                            <p className="font-medium text-foreground">{msg.suggestion_data.title}</p>
                                                            <p className="text-muted-foreground text-xs line-clamp-2">{msg.suggestion_data.content}</p>
                                                        </div>
                                                    )}
                                                    <Button size="sm" variant="outline" className="w-full text-xs h-8">
                                                        Create {msg.suggestion}
                                                    </Button>
                                                </div>
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

                        {/* Input */}
                        <div className="p-4 border-t border-accent/10 bg-card/50 backdrop-blur-sm">
                            <div className="max-w-3xl mx-auto flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 bg-background border-accent/20 focus-visible:ring-accent"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-accent hover:bg-accent/90"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}
