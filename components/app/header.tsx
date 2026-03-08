'use client'

import { useAuthStore } from '@/lib/auth-store'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Mic } from 'lucide-react'

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 md:ml-64">
        <div className="flex-1 flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes, reminders..."
                className="pl-10 bg-muted"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-lg">
            <Mic className="w-4 h-4" />
          </Button>

          <ThemeToggle />

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
