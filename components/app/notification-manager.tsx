'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth-store'
import { Bell, BellRing, Clock } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/app-store'

import { API_BASE } from '@/lib/api'

export function NotificationManager() {
    const { token, user } = useAuthStore()
    const { updateReminder, updateTodo } = useAppStore()
    const [activeNotification, setActiveNotification] = useState<{
        id: string
        title: string
        todoId?: string
    } | null>(null)
    const [activeNudge, setActiveNudge] = useState<{
        id: string
        title: string
    } | null>(null)

    useEffect(() => {
        if (!token || !user) return

        console.log('🔗 Connecting to SSE at:', `${API_BASE}/notifications/sse`)
        const eventSource = new EventSource(`${API_BASE}/notifications/sse?token=${token}`)

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                if (data.type === 'reminder_hit') {
                    toast.success(`Reminder: ${data.title}`, {
                        description: 'Time to take action!',
                        duration: 10000,
                        action: {
                            label: 'View',
                            onClick: () => setActiveNotification({
                                id: data.reminder_id,
                                title: data.title,
                                todoId: data.todo_id
                            })
                        }
                    })

                    setActiveNotification({
                        id: data.reminder_id,
                        title: data.title,
                        todoId: data.todo_id
                    })

                    // Always refresh data when a reminder hits because backend might have updated a Todo status
                    useAppStore.getState().fetchAll()
                } else if (data.type === 'task_nudge') {
                    setActiveNudge({
                        id: data.todo_id,
                        title: data.title
                    })
                    useAppStore.getState().fetchAll()
                }
            } catch (err) {
                console.error('Error parsing SSE data:', err)
            }
        }

        return () => {
            eventSource.close()
        }
    }, [token, user])

    const handleAcknowledge = async () => {
        if (activeNotification) {
            try {
                await updateReminder(activeNotification.id, { completed: true })
                toast.info('Reminder finished!')
            } catch (err) {
                console.error('Failed to update reminder:', err)
            }
        }
        setActiveNotification(null)
    }

    const handleExtend = async (minutes: number) => {
        if (activeNotification) {
            try {
                const newDate = new Date()
                newDate.setMinutes(newDate.getMinutes() + minutes)

                await updateReminder(activeNotification.id, {
                    dueDate: newDate.toISOString(),
                    completed: false,
                    notified: false
                })

                // If it was moved to in-progress, we might want to move it back to 'todo' if extended?
                // For now, let's just keep it simple and update the reminder.
                if (activeNotification.todoId) {
                    await updateTodo(activeNotification.todoId, { status: 'todo' })
                }

                toast.info(`Extended by ${minutes} minutes`)
            } catch (err) {
                console.error('Failed to extend reminder:', err)
            }
        }
        setActiveNotification(null)
    }

    const handleNudgeAction = async (action: 'done' | 'reschedule' | 'keep') => {
        if (activeNudge) {
            try {
                if (action === 'done') {
                    await updateTodo(activeNudge.id, { status: 'done' })
                    toast.success('Task marked as done!')
                } else if (action === 'reschedule') {
                    await updateTodo(activeNudge.id, { status: 'todo' })
                    toast.info('Task moved back to To Do')
                } else {
                    toast.info("Keep it up! I'll check back later.")
                }
            } catch (err) {
                console.error('Failed to handle nudge action:', err)
            }
        }
        setActiveNudge(null)
    }

    return (
        <>
            {/* Reminder Dialog */}
            <Dialog open={!!activeNotification} onOpenChange={(open: boolean) => !open && handleAcknowledge()}>
                <DialogContent className="sm:max-w-[400px] border-none shadow-2xl bg-background/95 backdrop-blur-md">
                    <DialogHeader className="flex flex-col items-center pt-6">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative rounded-full bg-primary/10 p-4 text-primary ring-1 ring-primary/20">
                                <BellRing className="h-8 w-8" />
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                            Action Required
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground/80 mt-1">
                            A scheduled event needs your attention
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-8 px-2 flex flex-col items-center space-y-5">
                        <h3 className="text-2xl font-extrabold text-foreground text-center leading-tight">
                            {activeNotification?.title}
                        </h3>

                        {activeNotification?.todoId && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
                                    In Progress
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-4">
                        <Button
                            variant="outline"
                            onClick={() => handleExtend(15)}
                            className="h-11 rounded-xl border-accent/20 hover:bg-accent/5 transition-all text-sm font-medium"
                        >
                            Snooze 15m
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleExtend(60)}
                            className="h-11 rounded-xl border-accent/20 hover:bg-accent/5 transition-all text-sm font-medium"
                        >
                            Snooze 1h
                        </Button>
                    </div>

                    <DialogFooter className="sm:justify-center pt-0 pb-6">
                        <Button
                            onClick={handleAcknowledge}
                            className="w-full h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-base font-bold"
                        >
                            Complete Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Task Nudge Dialog */}
            <Dialog open={!!activeNudge} onOpenChange={(open: boolean) => !open && setActiveNudge(null)}>
                <DialogContent className="sm:max-w-[400px] border-none shadow-2xl bg-background/95 backdrop-blur-md">
                    <DialogHeader className="flex flex-col items-center pt-6">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative rounded-full bg-accent/10 p-4 text-accent ring-1 ring-accent/20">
                                <Clock className="h-8 w-8" />
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                            Proactive Check-In
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground/80 mt-1">
                            You've been working on this for over an hour!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-8 px-2 flex flex-col items-center space-y-5">
                        <h3 className="text-2xl font-extrabold text-foreground text-center leading-tight">
                            {activeNudge?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center">
                            Have you completed this task yet?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pb-6">
                        <Button
                            onClick={() => handleNudgeAction('done')}
                            className="h-12 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all text-base font-bold"
                        >
                            Yes, I'm Finished!
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => handleNudgeAction('keep')}
                                className="h-12 rounded-xl border-accent/20 hover:bg-accent/5"
                            >
                                Still Working
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleNudgeAction('reschedule')}
                                className="h-12 rounded-xl border-accent/20 hover:bg-accent/5"
                            >
                                Reschedule
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
