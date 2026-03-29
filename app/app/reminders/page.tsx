'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { Plus, CheckCircle2, Circle, Clock, Trash2, Calendar } from 'lucide-react'

export default function RemindersPage() {
  const reminders = useAppStore((state) => state.reminders)
  const isLoading = useAppStore((state) => state.isLoading)
  const updateReminder = useAppStore((state) => state.updateReminder)
  const deleteReminder = useAppStore((state) => state.deleteReminder)
  const addReminder = useAppStore((state) => state.addReminder)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const filteredReminders = reminders.filter((reminder) => {
    if (filter === 'active') return !reminder.completed
    if (filter === 'completed') return reminder.completed
    return true
  })

  const handleAddReminder = () => {
    if (newTitle.trim()) {
      addReminder({
        title: newTitle,
        description: newDescription,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        priority: 'medium',
      })
      setNewTitle('')
      setNewDescription('')
    }
  }

  const handleToggleComplete = (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (reminder) {
      updateReminder(id, { completed: !reminder.completed })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
        <p className="text-muted-foreground mt-1">Never miss important tasks and deadlines</p>
      </div>

      {/* New Reminder Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Reminder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Reminder title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddReminder()}
            disabled={isLoading}
          />
          <Input
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleAddReminder} className="w-full gap-2" disabled={isLoading || !newTitle.trim()}>
            <Plus className="w-4 h-4" />
            {isLoading ? 'Processing...' : 'Add Reminder'}
          </Button>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${filter === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'all' && ` (${reminders.length})`}
            {tab === 'active' && ` (${reminders.filter((r) => !r.completed).length})`}
            {tab === 'completed' && ` (${reminders.filter((r) => r.completed).length})`}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No {filter !== 'all' ? filter : ''} reminders yet
            </CardContent>
          </Card>
        ) : (
          filteredReminders.map((reminder) => (
            <Card key={reminder.id} className={reminder.completed ? 'opacity-60' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(reminder.id)}
                    className="flex-shrink-0 mt-1"
                    disabled={isLoading}
                  >
                    {reminder.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-foreground ${reminder.completed ? 'line-through' : ''}`}>
                      {reminder.title}
                    </h3>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${reminder.priority === 'high'
                        ? 'bg-destructive/10 text-destructive'
                        : reminder.priority === 'medium'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-muted text-muted-foreground'
                        }`}>
                        {reminder.priority}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
