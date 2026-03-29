'use client'

import { useAppStore } from '@/lib/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Copy, Share2, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export function NoteEditor() {
  const selectedNoteId = useAppStore((state) => state.selectedNoteId)
  const notes = useAppStore((state) => state.notes)
  const updateNote = useAppStore((state) => state.updateNote)
  const deleteNote = useAppStore((state) => state.deleteNote)
  const setSelectedNoteId = useAppStore((state) => state.setSelectedNoteId)

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // 1. Sync local state when a new note is selected
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title)
      setContent(selectedNote.content)
    }
  }, [selectedNoteId]) // Only re-sync when the selected ID changes

  // 2. Debounced Auto-save Logic
  useEffect(() => {
    if (!selectedNote) return

    // Don't save if nothing changed since last store update
    if (title === selectedNote.title && content === selectedNote.content) {
      return
    }

    const timer = setTimeout(() => {
      updateNote(selectedNote.id, { title, content })
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, content, selectedNoteId])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleDelete = () => {
    if (selectedNote && confirm('Are you sure you want to delete this note?')) {
      deleteNote(selectedNote.id)
      setSelectedNoteId(null)
    }
  }

  if (!selectedNote) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a note to start editing</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title..."
            className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Updated {new Date(selectedNote.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Zap className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-4">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Write your note here... Markdown is supported!"
          className="min-h-full border-0 p-0 focus-visible:ring-0 resize-none font-mono text-sm"
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 flex justify-between items-center bg-muted/20 text-xs text-muted-foreground">
        <div className="space-x-4">
          <span>{selectedNote.tags.length} tags</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
          <span>{content.length} characters</span>
        </div>
      </div>
    </div>
  )
}
