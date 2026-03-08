'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type Status = 'todo' | 'in-progress' | 'done'

export default function TodosPage() {
  const todos = useAppStore((state) => state.todos)
  const updateTodo = useAppStore((state) => state.updateTodo)
  const deleteTodo = useAppStore((state) => state.deleteTodo)
  const addTodo = useAppStore((state) => state.addTodo)
  const [newTitle, setNewTitle] = useState('')

  const getStatusLabel = (status: Status) => {
    return status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'
  }

  const getStatusColor = (status: Status) => {
    return status === 'todo'
      ? 'bg-muted'
      : status === 'in-progress'
      ? 'bg-accent/10 border-accent/30'
      : 'bg-chart-3/10 border-chart-3/30'
  }

  const handleAddTodo = () => {
    if (newTitle.trim()) {
      addTodo({
        title: newTitle,
        status: 'todo',
        priority: 'medium',
        boardId: 'default',
      })
      setNewTitle('')
    }
  }

  const handleStatusChange = (id: string, status: Status) => {
    updateTodo(id, { status })
  }

  const getGroupedTodos = () => {
    const grouped: Record<Status, typeof todos> = {
      todo: [],
      'in-progress': [],
      done: [],
    }
    todos.forEach((todo) => {
      grouped[todo.status].push(todo)
    })
    return grouped
  }

  const grouped = getGroupedTodos()
  const statuses: Status[] = ['todo', 'in-progress', 'done']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Organize and track your work</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {todos.filter((t) => t.status === 'done').length} of {todos.length} completed
        </div>
      </div>

      {/* New Task Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <Button onClick={handleAddTodo} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => (
          <div key={status} className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{getStatusLabel(status)}</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {grouped[status].length}
              </span>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3 min-h-96 rounded-lg border border-border bg-muted/20 p-4">
              {grouped[status].length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No tasks
                </p>
              ) : (
                grouped[status].map((todo) => (
                  <Card
                    key={todo.id}
                    className={`cursor-move hover:shadow-md transition-shadow border ${getStatusColor(status)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm">{todo.title}</h3>
                          {todo.description && (
                            <p className="text-xs text-muted-foreground mt-1">{todo.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            {status !== 'done' && (
                              <>
                                {status === 'todo' && (
                                  <button
                                    onClick={() => handleStatusChange(todo.id, 'in-progress')}
                                    className="text-xs px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20"
                                  >
                                    Start
                                  </button>
                                )}
                                {status === 'in-progress' && (
                                  <button
                                    onClick={() => handleStatusChange(todo.id, 'done')}
                                    className="text-xs px-2 py-1 rounded bg-chart-3/10 text-chart-3 hover:bg-chart-3/20"
                                  >
                                    Complete
                                  </button>
                                )}
                              </>
                            )}
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              todo.priority === 'high'
                                ? 'bg-destructive/10 text-destructive'
                                : todo.priority === 'medium'
                                ? 'bg-accent/10 text-accent'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
