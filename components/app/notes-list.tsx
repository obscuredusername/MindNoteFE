'use client'

import { useAppStore } from '@/lib/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function NotesList() {
  const notes = useAppStore((state) => state.notes)
  const selectedNoteId = useAppStore((state) => state.selectedNoteId)
  const setSelectedNoteId = useAppStore((state) => state.setSelectedNoteId)
  const addNote = useAppStore((state) => state.addNote)
  const deleteNote = useAppStore((state) => state.deleteNote)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewNote = () => {
    addNote({
      title: 'Untitled Note',
      content: '',
      tags: [],
    })
  }

  return (
    <div className="w-80 border-r border-border bg-muted/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <Button onClick={handleNewNote} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? 'No notes found' : 'No notes yet. Create one to get started!'}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                  selectedNoteId === note.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                }`}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <h3 className="font-medium text-foreground truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content || 'No content'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
