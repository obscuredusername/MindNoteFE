'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { SessionSidebar } from './components/SessionSidebar'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { useAppStore } from '@/lib/app-store'
import { toast } from 'sonner'

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
            if (data.length > 0) {
                const activeSession = data.find(s => s.id === currentSessionId) || data[0]
                setCurrentSessionId(activeSession.id)
            }
        } catch (error) {
            console.error('Error fetching sessions:', error)
        } finally {
            setIsInitialLoading(false)
        }
    }

    const fetchMessages = async (chatId: string) => {
        if (!chatId || chatId === 'undefined') return
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

    const handleExecuteSuggestion = async (suggestion: string, data: any) => {
        if (!data) return
        const store = useAppStore.getState()
        try {
            if (suggestion === 'notes') {
                await store.addNote({ title: data.title || 'Untitled Note', content: data.content || '' })
            } else if (suggestion === 'reminder') {
                const dueDate = data.due_date || new Date(Date.now() + 3600000).toISOString()
                await store.addReminder({
                    title: data.title || 'Untitled Reminder',
                    description: data.content || '',
                    dueDate,
                    completed: false,
                    priority: data.priority || 'medium'
                })
            } else if (suggestion === 'task') {
                await store.addTodo({
                    title: data.title || 'Untitled Task',
                    description: data.content || '',
                    status: 'todo',
                    priority: data.priority || 'medium'
                })
            }
            toast.success(`${suggestion.charAt(0).toUpperCase() + suggestion.slice(1)} created successfully!`, {
                description: `Added "${data.title}" to your library.`,
            })
        } catch (error) {
            console.error('Error executing suggestion:', error)
            toast.error(`Failed to create ${suggestion}`)
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-full w-full gap-0 md:gap-4 overflow-hidden md:p-4 bg-background">
            {/* Session Sidebar */}
            <div className={`md:w-72 h-full flex shrink-0 ${currentSessionId ? 'hidden md:flex' : 'flex'}`}>
                <SessionSidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    isInitialLoading={isInitialLoading}
                    onSelectSession={setCurrentSessionId}
                    onNewChat={startNewChat}
                    onDeleteSession={deleteSession}
                />
            </div>

            {/* Chat Content Overlay */}
            <Card className="flex-1 flex flex-col border-accent/20 bg-gradient-to-br from-card/80 via-background to-accent/5 overflow-hidden shadow-2xl relative rounded-none md:rounded-3xl border-0 md:border min-h-0 min-w-0">
                {!currentSessionId ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center shadow-inner">
                            <Sparkles className="w-10 h-10 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight">MindNote AI</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm font-medium">
                                Start a chat to organize your notes, reminders, and tasks.
                            </p>
                        </div>
                        <Button onClick={startNewChat} className="mt-4 px-8 py-6 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all active:scale-95 text-accent-foreground font-black">
                            Start Your First Conversation
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 h-full min-h-0 w-full overflow-hidden">
                        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
                            <MessageList messages={messages} isLoading={isLoading} onExecuteSuggestion={handleExecuteSuggestion} />
                        </div>
                        <div className="shrink-0 w-full border-t border-accent/10 bg-background/95 backdrop-blur-sm z-30">
                            <ChatInput value={input} onChange={setInput} onSend={sendMessage} isLoading={isLoading} />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
