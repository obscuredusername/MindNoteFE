'use client'

import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Bell, Lock, Users, Palette, Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Username</label>
            <Input type="text" value={user?.username} disabled className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input type="email" value={user?.email} disabled className="mt-2" />
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Reminder Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about upcoming reminders</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Task Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about task changes</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your data and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            View Active Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="overflow-hidden border-2 border-accent/10">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of Mindnote</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Main Theme Selection */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Select Theme
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* Light Theme Option */}
              <button
                onClick={() => setTheme('light')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group ${theme === 'light'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-lg shadow-primary/10'
                  : 'border-muted bg-muted/20 hover:border-accent/30 hover:bg-muted/40'
                  }`}
              >
                <div className={`p-3 rounded-full mb-3 ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground group-hover:text-foreground shadow-sm animate-in'}`}>
                  <Sun className="h-6 w-6" />
                </div>
                <span className={`text-sm font-bold ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>LIGHT</span>
                {theme === 'light' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* Dark Theme Option */}
              <button
                onClick={() => setTheme('dark')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group ${theme === 'dark'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-lg shadow-primary/10'
                  : 'border-muted bg-muted/20 hover:border-accent/30 hover:bg-muted/40'
                  }`}
              >
                <div className={`p-3 rounded-full mb-3 ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground group-hover:text-foreground shadow-sm'}`}>
                  <Moon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`}>DARK</span>
                {theme === 'dark' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* System Theme Option */}
              <button
                onClick={() => setTheme('system')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 group ${theme === 'system'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-lg shadow-primary/10'
                  : 'border-muted bg-muted/20 hover:border-accent/30 hover:bg-muted/40'
                  }`}
              >
                <div className={`p-3 rounded-full mb-3 ${theme === 'system' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground group-hover:text-foreground shadow-sm'}`}>
                  <Monitor className="h-6 w-6" />
                </div>
                <span className={`text-sm font-bold ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`}>SYSTEM</span>
                {theme === 'system' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30 border-2 bg-destructive/5 shadow-xl shadow-destructive/5 overflow-hidden">
        <CardHeader className="bg-destructive/10">
          <CardTitle className="text-destructive flex items-center gap-2">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80 font-medium">Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button variant="outline" className="w-full justify-start text-foreground bg-background hover:bg-muted font-semibold">
            Export My Data (.JSON/.MD)
          </Button>
          <Button
            variant="destructive"
            className="w-full font-black text-lg py-6 shadow-lg shadow-destructive/30 hover:scale-[1.01] transition-transform"
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
          <div className="pt-4 border-t border-destructive/20 mt-4">
            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 font-bold text-xs uppercase tracking-widest">
              Delete Account Permanently
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

