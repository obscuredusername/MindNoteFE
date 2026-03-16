import { create } from 'zustand'
import { api } from '@/lib/api'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Reminder {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface Todo {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  boardId: string
}

interface AppStore {
  // Navigation
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Global Fetch
  isLoading: boolean
  fetchAll: () => Promise<void>

  // Notes
  notes: Note[]
  selectedNoteId: string | null
  setSelectedNoteId: (id: string | null) => void
  fetchNotes: () => Promise<void>
  addNote: (note: Partial<Note>) => Promise<void>
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>

  // Reminders
  reminders: Reminder[]
  fetchReminders: () => Promise<void>
  addReminder: (reminder: Partial<Reminder>) => Promise<void>
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>
  deleteReminder: (id: string) => Promise<void>

  // Todos
  todos: Todo[]
  fetchTodos: () => Promise<void>
  addTodo: (todo: Partial<Todo>) => Promise<void>
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Navigation
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Global Fetch
  isLoading: false,
  fetchAll: async () => {
    set({ isLoading: true })
    try {
      await Promise.all([
        get().fetchNotes(),
        get().fetchReminders(),
        get().fetchTodos()
      ])
    } finally {
      set({ isLoading: false })
    }
  },

  // Notes
  notes: [],
  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  fetchNotes: async () => {
    const data = await api.get<Note[]>('/writer/notes')
    set({ notes: data })
    if (data.length > 0 && !get().selectedNoteId) {
      set({ selectedNoteId: data[0].id })
    }
  },
  addNote: async (note) => {
    await api.post('/writer/notes', note)
    await get().fetchNotes()
  },
  updateNote: async (id, updates) => {
    await api.patch(`/writer/notes/${id}`, updates)
    await get().fetchNotes()
  },
  deleteNote: async (id) => {
    await api.delete(`/writer/notes/${id}`)
    await get().fetchNotes()
  },

  // Reminders
  reminders: [],
  fetchReminders: async () => {
    const data = await api.get<Reminder[]>('/writer/reminders')
    set({ reminders: data })
  },
  addReminder: async (reminder) => {
    await api.post('/writer/reminders', reminder)
    await get().fetchReminders()
  },
  updateReminder: async (id, updates) => {
    await api.patch(`/writer/reminders/${id}`, updates)
    await get().fetchReminders()
  },
  deleteReminder: async (id) => {
    await api.delete(`/writer/reminders/${id}`)
    await get().fetchReminders()
  },

  // Todos
  todos: [],
  fetchTodos: async () => {
    const data = await api.get<Todo[]>('/writer/todos')
    set({ todos: data })
  },
  addTodo: async (todo) => {
    await api.post('/writer/todos', todo)
    await get().fetchTodos()
  },
  updateTodo: async (id, updates) => {
    await api.patch(`/writer/todos/${id}`, updates)
    await get().fetchTodos()
  },
  deleteTodo: async (id) => {
    await api.delete(`/writer/todos/${id}`)
    await get().fetchTodos()
  },
}))
