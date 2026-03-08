import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, ApiError } from '@/lib/api'

// ── Types ───────────────────────────────────────────────────────

export interface User {
  id: string
  username: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string | null
}

interface AuthResponse {
  user: User
  access_token: string
  token_type: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
  setUser: (user: User | null) => void
}

// ── Store ───────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Sign in ──────────────────────────────────────────────
      login: async (email: string, password: string) => {
        const data = await api.post<AuthResponse>('/users/signin', {
          email,
          password,
        })

        set({
          user: data.user,
          token: data.access_token,
          isAuthenticated: true,
        })
      },

      // ── Sign up ──────────────────────────────────────────────
      register: async (email: string, password: string, username: string) => {
        const data = await api.post<AuthResponse>('/users/signup', {
          username,
          email,
          password,
        })

        set({
          user: data.user,
          token: data.access_token,
          isAuthenticated: true,
        })
      },

      // ── Logout ───────────────────────────────────────────────
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      // ── Refresh session from token ───────────────────────────
      fetchMe: async () => {
        const { token } = get()
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false })
          return
        }

        try {
          const user = await api.get<User>('/users/me')
          set({ user, isAuthenticated: true })
        } catch (err) {
          // Token expired or invalid — clear session
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
            set({ user: null, token: null, isAuthenticated: false })
          }
          throw err
        }
      },

      // ── Manual set ───────────────────────────────────────────
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: user !== null })
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
