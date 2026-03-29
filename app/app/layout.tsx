'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from '@/components/app/sidebar'
import { Header } from '@/components/app/header'
import { NotificationManager } from '@/components/app/notification-manager'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/app-store'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, token, fetchMe, isHydrated } = useAuthStore()
  const fetchAll = useAppStore((state) => state.fetchAll)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Wait for the auth store to read from localStorage
    if (!isHydrated) return

    // If there's no token after hydration, redirect immediately
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // Validate the session against the backend
    fetchMe()
      .then(() => {
        fetchAll()
      })
      .catch(() => {
        // Token is invalid/expired — redirect to login
        router.replace('/auth/login')
      })
      .finally(() => {
        setIsChecking(false)
      })
  }, [token, fetchMe, router, fetchAll, isHydrated])

  const isChat = pathname?.includes('/chat')

  // Show nothing while checking session (avoids flash of content)
  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <NotificationManager />
      <div className="flex-1 flex flex-col md:ml-64 h-full relative">
        <Header />
        <main className={`flex-1 ${isChat ? 'h-[calc(100vh-4rem)] overflow-hidden p-0' : 'p-4 md:p-6 overflow-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
