'use client'

import { NotesList } from '@/components/app/notes-list'
import { NoteEditor } from '@/components/app/note-editor'

export default function NotesPage() {
  return (
    <div className="flex h-full gap-0 -m-4 md:-m-6">
      <NotesList />
      <NoteEditor />
    </div>
  )
}
