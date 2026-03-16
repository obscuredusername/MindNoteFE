'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const { isAuthenticated, token, fetchMe } = useAuthStore()
  const fetchAll = useAppStore((state) => state.fetchAll)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // If there's no token at all, redirect immediately
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
  }, [token, fetchMe, router, fetchAll])

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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <NotificationManager />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
