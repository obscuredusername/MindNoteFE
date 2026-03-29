'use client'

import { useAuthStore } from '@/lib/auth-store'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Mic, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <Input
                type="search"
                placeholder="Search notes, reminders..."
                className="pl-10 bg-muted/50 border-accent/10 focus-visible:ring-accent rounded-full h-9"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/app/chat">
            <Button variant="ghost" className="gap-2 text-accent font-bold hover:bg-accent/10 hover:text-accent px-3 transition-all rounded-full flex">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </Button>
          </Link>

          <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-accent/20 hover:border-accent group">
            <Mic className="w-4 h-4 group-hover:text-accent" />
          </Button>

          <ThemeToggle />

          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border ml-1 md:ml-0">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-foreground leading-none">{user?.username}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary text-accent-foreground flex items-center justify-center text-xs font-black shadow-lg shadow-accent/20 ring-2 ring-background ring-offset-2 ring-offset-accent/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
