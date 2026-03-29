'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { SessionSidebar } from './components/SessionSidebar'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
    suggestion?: string
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

    useEffect(() => { fetchSessions() }, [])

    useEffect(() => {
        if (currentSessionId) fetchMessages(currentSessionId)
        else setMessages([])
    }, [currentSessionId])

    const fetchSessions = async () => {
        try {
            const data = await api.get<ChatSession[]>('/chat/sessions')
            setSessions(data)
            if (data.length > 0) setCurrentSessionId(data[0].id)
        } catch (error) {
            console.error('Error fetching sessions:', error)
        } finally {
            setIsInitialLoading(false)
        }
    }

    const fetchMessages = async (chatId: string) => {
        try {
            const data = await api.get<{ messages: Message[] }>(`/chat/sessions/${chatId}`)
            setMessages(data.messages)
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    const startNewChat = async () => {
        try {
            const data = await api.post<{ chat_id: string; title: string }>('/chat/sessions', { title: 'New Chat' })
            setSessions((prev) => [{ id: data.chat_id, title: data.title, updated_at: new Date().toISOString() }, ...prev])
            setCurrentSessionId(data.chat_id)
        } catch (error) {
            console.error('Error creating session:', error)
        }
    }

    const deleteSession = async (id: string) => {
        try {
            await api.delete(`/chat/sessions/${id}`)
            setSessions((prev) => prev.filter((s) => s.id !== id))
            if (currentSessionId === id) setCurrentSessionId(null)
        } catch (error) {
            console.error('Error deleting session:', error)
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || !currentSessionId || isLoading) return

        const userMsg = input
        setInput('')
        setMessages((prev) => [...prev, { role: 'user', content: userMsg, timestamp: new Date().toISOString() }])
        setIsLoading(true)

        try {
            const data = await api.post<{ reply: string; suggestion?: string; suggestion_data?: any; title?: string }>(
                `/chat/sessions/${currentSessionId}/chat`,
                { message: userMsg }
            )
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString(),
                suggestion: data.suggestion,
                suggestion_data: data.suggestion_data,
            }])
            if (data.title) {
                setSessions((prev) => prev.map((s) => s.id === currentSessionId ? { ...s, title: data.title! } : s))
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden">
            <SessionSidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                isInitialLoading={isInitialLoading}
                onSelectSession={setCurrentSessionId}
                onNewChat={startNewChat}
                onDeleteSession={deleteSession}
            />

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
                        <MessageList messages={messages} isLoading={isLoading} />
                        <ChatInput value={input} onChange={setInput} onSend={sendMessage} isLoading={isLoading} />
                    </>
                )}
            </Card>
        </div>
    )
}
