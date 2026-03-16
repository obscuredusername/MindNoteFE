'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth-store'
import { Bell, BellRing } from 'lucide-react'
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
    const { updateReminder } = useAppStore()
    const [activeNotification, setActiveNotification] = useState<{
        id: string
        title: string
    } | null>(null)

    useEffect(() => {
        if (!token || !user) return

        // SSE doesn't support headers in the browser's native EventSource
        // So we pass the token as a query parameter
        console.log('🔗 Connecting to SSE at:', `${API_BASE}/notifications/sse`)
        const eventSource = new EventSource(`${API_BASE}/notifications/sse?token=${token}`)

        eventSource.onopen = () => {
            console.log('✅ SSE Connection established')
        }

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                if (data.type === 'reminder_hit') {
                    // Play a subtle sound if possible, or just show a high-priority toast
                    toast.success(`Reminder: ${data.title}`, {
                        description: 'Time to take action!',
                        duration: 10000, // 10 seconds
                        action: {
                            label: 'View',
                            onClick: () => setActiveNotification({ id: data.reminder_id, title: data.title })
                        }
                    })

                    // Also show the modal for focus
                    setActiveNotification({ id: data.reminder_id, title: data.title })
                }
            } catch (err) {
                console.error('Error parsing SSE data:', err)
            }
        }

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err)
            // Browser will automatically retry EventSource
        }

        return () => {
            eventSource.close()
        }
    }, [token, user])

    const handleAcknowledge = async () => {
        if (activeNotification) {
            try {
                // Mark as completed when acknowledged
                await updateReminder(activeNotification.id, { completed: true })
                toast.info('Marked as completed')
            } catch (err) {
                console.error('Failed to update reminder:', err)
            }
        }
        setActiveNotification(null)
    }

    return (
        <>
            <Dialog open={!!activeNotification} onOpenChange={(open: boolean) => !open && handleAcknowledge()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-3 text-primary animate-bounce">
                            <BellRing className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-xl">Reminder Alert!</DialogTitle>
                        <DialogDescription className="text-center">
                            It's time for your scheduled reminder:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 text-center">
                        <h3 className="text-2xl font-bold text-foreground">
                            {activeNotification?.title}
                        </h3>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button onClick={handleAcknowledge} className="w-full">
                            Got it, thanks!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
