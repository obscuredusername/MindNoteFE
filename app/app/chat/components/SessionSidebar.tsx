import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, MessageCircle, Trash2, MoreVertical, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChatSession {
    id: string
    title: string
    updated_at: string
}

interface SessionSidebarProps {
    sessions: ChatSession[]
    currentSessionId: string | null
    isInitialLoading: boolean
    onSelectSession: (id: string) => void
    onNewChat: () => void
    onDeleteSession: (id: string) => void
}

export function SessionSidebar({
    sessions,
    currentSessionId,
    isInitialLoading,
    onSelectSession,
    onNewChat,
    onDeleteSession,
}: SessionSidebarProps) {
    return (
        <Card className="w-80 flex flex-col border-accent/20">
            <div className="p-4 border-b border-accent/10">
                <Button
                    onClick={onNewChat}
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
                            onClick={() => onSelectSession(session.id)}
                            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${currentSessionId === session.id
                                    ? 'bg-accent/10 text-accent font-medium'
                                    : 'hover:bg-accent/5 text-muted-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageCircle className={`w-4 h-4 flex-shrink-0 ${currentSessionId === session.id ? 'text-accent' : 'text-muted-foreground/50'
                                    }`} />
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
                                        onClick={() => onDeleteSession(session.id)}
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
    )
}
