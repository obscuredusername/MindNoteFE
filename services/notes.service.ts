import { api } from '@/lib/api'
import type { Note } from '@/lib/app-store'

export const notesService = {
    list: () => api.get<Note[]>('/writer/notes'),
    create: (note: Partial<Note>) => api.post<Note>('/writer/notes', note),
    update: (id: string, updates: Partial<Note>) => api.patch<Note>(`/writer/notes/${id}`, updates),
    remove: (id: string) => api.delete(`/writer/notes/${id}`),
}
