'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/app-store'
import { BookOpen, Clock, CheckSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function RecentNotesWidget() {
  const notes = useAppStore((state) => state.notes).slice(0, 3)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Recent Notes
        </CardTitle>
        <CardDescription>Your latest entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <p className="font-medium text-sm text-foreground">{note.title}</p>
              <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                {mounted ? new Date(note.updatedAt).toLocaleDateString() : '—'}
              </p>
            </div>
          ))}
        </div>
        <Link href="/app/notes" className="mt-4 block">
          <Button variant="outline" className="w-full">View All Notes</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function RemindersWidget() {
  const reminders = useAppStore((state) => state.reminders)
    .filter((r) => !r.completed)
    .slice(0, 3)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming Reminders
        </CardTitle>
        <CardDescription>What's coming up</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start justify-between">
                <p className="font-medium text-sm text-foreground">{reminder.title}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  reminder.priority === 'high'
                    ? 'bg-destructive/10 text-destructive'
                    : reminder.priority === 'medium'
                    ? 'bg-accent/10 text-accent'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {reminder.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                {mounted ? new Date(reminder.dueDate).toLocaleDateString() : '—'}
              </p>
            </div>
          ))}
        </div>
        <Link href="/app/reminders" className="mt-4 block">
          <Button variant="outline" className="w-full">View All</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function TodosWidget() {
  const todos = useAppStore((state) => state.todos).slice(0, 4)
  const completed = todos.filter((t) => t.status === 'done').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Tasks
        </CardTitle>
        <CardDescription>{completed} of {todos.length} completed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                todo.status === 'done'
                  ? 'bg-primary border-primary'
                  : 'border-border'
              }`}>
                {todo.status === 'done' && <span className="text-xs text-primary-foreground">✓</span>}
              </div>
              <p className={`text-sm ${todo.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {todo.title}
              </p>
            </div>
          ))}
        </div>
        <Link href="/app/todos" className="mt-4 block">
          <Button variant="outline" className="w-full">Manage Tasks</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function StatsWidget() {
  const notes = useAppStore((state) => state.notes)
  const reminders = useAppStore((state) => state.reminders)
  const todos = useAppStore((state) => state.todos)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Overview
        </CardTitle>
        <CardDescription>Your activity snapshot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-primary">{notes.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Notes</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-accent">{reminders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Reminders</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-chart-3">{todos.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-chart-2">{todos.filter(t => t.status === 'done').length}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
