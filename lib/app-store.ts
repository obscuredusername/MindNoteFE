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

// ── Mappers ─────────────────────────────────────────────────────

const mapNote = (n: any): Note => ({
  id: n.id,
  title: n.title,
  content: n.content,
  tags: n.tags || [],
  createdAt: n.created_at,
  updatedAt: n.updated_at
})

const mapReminder = (r: any): Reminder => ({
  id: r.id,
  title: r.title,
  description: r.description,
  dueDate: r.due_date,
  completed: r.completed,
  priority: r.priority
})

const mapTodo = (t: any): Todo => ({
  id: t.id,
  title: t.title,
  description: t.description,
  status: t.status,
  priority: t.priority,
  boardId: t.board_id
})

// Reverse mappers for sending data back to API
const toSnake = (obj: any) => {
  const result: any = {}
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = obj[key]
  }
  return result
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
    const data = await api.get<any[]>('/writer/notes')
    set({ notes: data.map(mapNote) })
    if (data.length > 0 && !get().selectedNoteId) {
      set({ selectedNoteId: data[0].id })
    }
  },
  addNote: async (note) => {
    set({ isLoading: true })
    try {
      await api.post('/writer/notes', toSnake(note))
      await get().fetchNotes()
    } finally {
      set({ isLoading: false })
    }
  },
  updateNote: async (id, updates) => {
    await api.patch(`/writer/notes/${id}`, toSnake(updates))
    await get().fetchNotes()
  },
  deleteNote: async (id) => {
    set({ isLoading: true })
    try {
      await api.delete(`/writer/notes/${id}`)
      await get().fetchNotes()
    } finally {
      set({ isLoading: false })
    }
  },

  // Reminders
  reminders: [],
  fetchReminders: async () => {
    const data = await api.get<any[]>('/writer/reminders')
    set({ reminders: data.map(mapReminder) })
  },
  addReminder: async (reminder) => {
    set({ isLoading: true })
    try {
      await api.post('/writer/reminders', toSnake(reminder))
      await get().fetchReminders()
    } finally {
      set({ isLoading: false })
    }
  },
  updateReminder: async (id, updates) => {
    set({ isLoading: true })
    try {
      await api.patch(`/writer/reminders/${id}`, toSnake(updates))
      await get().fetchReminders()
    } finally {
      set({ isLoading: false })
    }
  },
  deleteReminder: async (id) => {
    set({ isLoading: true })
    try {
      await api.delete(`/writer/reminders/${id}`)
      await get().fetchReminders()
    } finally {
      set({ isLoading: false })
    }
  },

  // Todos
  todos: [],
  fetchTodos: async () => {
    const data = await api.get<any[]>('/writer/todos')
    set({ todos: data.map(mapTodo) })
  },
  addTodo: async (todo) => {
    set({ isLoading: true })
    try {
      await api.post('/writer/todos', toSnake(todo))
      await get().fetchTodos()
    } finally {
      set({ isLoading: false })
    }
  },
  updateTodo: async (id, updates) => {
    set({ isLoading: true })
    try {
      await api.patch(`/writer/todos/${id}`, toSnake(updates))
      await get().fetchTodos()
    } finally {
      set({ isLoading: false })
    }
  },
  deleteTodo: async (id) => {
    set({ isLoading: true })
    try {
      await api.delete(`/writer/todos/${id}`)
      await get().fetchTodos()
    } finally {
      set({ isLoading: false })
    }
  },
}))
