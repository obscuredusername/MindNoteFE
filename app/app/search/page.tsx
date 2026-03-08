'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/app-store'
import { Search as SearchIcon, BookOpen, Clock, CheckSquare } from 'lucide-react'

export default function SearchPage() {
  const notes = useAppStore((state) => state.notes)
  const reminders = useAppStore((state) => state.reminders)
  const todos = useAppStore((state) => state.todos)
  const [query, setQuery] = useState('')

  const searchResults = {
    notes: notes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    ),
    reminders: reminders.filter((reminder) =>
      reminder.title.toLowerCase().includes(query.toLowerCase()) ||
      reminder.description.toLowerCase().includes(query.toLowerCase())
    ),
    todos: todos.filter((todo) =>
      todo.title.toLowerCase().includes(query.toLowerCase()) ||
      (todo.description?.toLowerCase() || '').includes(query.toLowerCase())
    ),
  }

  const totalResults =
    searchResults.notes.length +
    searchResults.reminders.length +
    searchResults.todos.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search</h1>
        <p className="text-muted-foreground mt-1">Search across all your content</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search notes, reminders, tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 text-lg"
          autoFocus
        />
      </div>

      {/* Results */}
      {query ? (
        <div className="space-y-8">
          {totalResults === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No results found for "{query}"
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Notes Results */}
              {searchResults.notes.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Notes ({searchResults.notes.length})
                  </h2>
                  <div className="space-y-3">
                    {searchResults.notes.map((note) => (
                      <Card key={note.id} className="hover:border-primary/30 transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-base">{note.title}</CardTitle>
                          <CardDescription>{note.content.substring(0, 100)}...</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Reminders Results */}
              {searchResults.reminders.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Reminders ({searchResults.reminders.length})
                  </h2>
                  <div className="space-y-3">
                    {searchResults.reminders.map((reminder) => (
                      <Card key={reminder.id} className="hover:border-primary/30 transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-base">{reminder.title}</CardTitle>
                          <CardDescription>{reminder.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Todos Results */}
              {searchResults.todos.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Tasks ({searchResults.todos.length})
                  </h2>
                  <div className="space-y-3">
                    {searchResults.todos.map((todo) => (
                      <Card key={todo.id} className="hover:border-primary/30 transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-base">{todo.title}</CardTitle>
                          <CardDescription>
                            Status: {todo.status === 'done' ? 'Done' : todo.status === 'in-progress' ? 'In Progress' : 'To Do'}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Start typing to search...
          </CardContent>
        </Card>
      )}
    </div>
  )
}
