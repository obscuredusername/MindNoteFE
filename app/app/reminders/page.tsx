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
  const [newDueDate, setNewDueDate] = useState<string>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
  })

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
        dueDate: new Date(newDueDate).toISOString(),
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
      <Card className="border-2 border-primary/50 shadow-xl">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Reminder (Force Updated)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-black uppercase text-foreground/70">1. Set Deadline (Date & Time)</label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  disabled={isLoading}
                  className="border-2 border-primary/30 h-12 text-lg font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-black uppercase text-foreground/70">2. Reminder Title</label>
              <Input
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAddReminder()}
                disabled={isLoading}
                className="h-12"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-xs font-black uppercase text-foreground/70">3. Description (Extra Context)</label>
            <Input
              placeholder="Add some details..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={isLoading}
              className="h-12"
            />
          </div>

          <Button
            onClick={handleAddReminder}
            className="w-full h-14 text-lg font-black gap-2 shadow-lg hover:scale-[1.01] transition-transform"
            disabled={isLoading || !newTitle.trim()}
          >
            <Plus className="w-6 h-6" />
            {isLoading ? 'CREATING...' : 'SAVE REMINDER'}
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
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                        <Calendar className="w-4 h-4" />
                        {new Date(reminder.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-full font-bold">
                        <Clock className="w-4 h-4" />
                        {new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm ${reminder.priority === 'high'
                        ? 'bg-destructive/20 text-destructive border border-destructive/30'
                        : reminder.priority === 'medium'
                          ? 'bg-accent/20 text-accent border border-accent/30'
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

