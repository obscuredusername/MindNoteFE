import { create } from 'zustand'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface Reminder {
  id: string
  title: string
  description: string
  dueDate: Date
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

  // Notes
  notes: Note[]
  selectedNoteId: string | null
  setSelectedNoteId: (id: string | null) => void
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void

  // Reminders
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id'>) => void
  updateReminder: (id: string, updates: Partial<Reminder>) => void
  deleteReminder: (id: string) => void

  // Todos
  todos: Todo[]
  addTodo: (todo: Omit<Todo, 'id'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Navigation
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Notes
  notes: [
    {
      id: '1',
      title: 'Welcome to Mindnote',
      content: '# Welcome to Mindnote\n\nStart capturing your thoughts here. Use markdown to format your notes.',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['welcome'],
    },
  ],
  selectedNoteId: '1',
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  addNote: (note) => {
    const newNote: Note = {
      ...note,
      id: Math.random().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({ notes: [newNote, ...state.notes] }))
  },
  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      ),
    }))
  },
  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    }))
  },

  // Reminders
  reminders: [
    {
      id: '1',
      title: 'Review notes',
      description: 'Review and organize recent notes',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false,
      priority: 'high',
    },
  ],
  addReminder: (reminder) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Math.random().toString(),
    }
    set((state) => ({ reminders: [newReminder, ...state.reminders] }))
  },
  updateReminder: (id, updates) => {
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      ),
    }))
  },
  deleteReminder: (id) => {
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id),
    }))
  },

  // Todos
  todos: [
    {
      id: '1',
      title: 'Get started',
      description: 'Explore Mindnote features',
      status: 'in-progress',
      priority: 'high',
      boardId: 'default',
    },
  ],
  addTodo: (todo) => {
    const newTodo: Todo = {
      ...todo,
      id: Math.random().toString(),
    }
    set((state) => ({ todos: [newTodo, ...state.todos] }))
  },
  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    }))
  },
  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }))
  },
}))
