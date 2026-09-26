import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string; user?: User; token?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()

          if (!res.ok || !data.success) {
            set({ isLoading: false, error: data.message || 'Login failed' })
            return { success: false, message: data.message || 'Login failed' }
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return { success: true, user: data.user, token: data.token }
        } catch (err: any) {
          const message = err.message || 'Network error occurred'
          set({ isLoading: false, error: message })
          return { success: false, message }
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone }),
          })
          const data = await res.json()

          if (!res.ok || !data.success) {
            set({ isLoading: false, error: data.message || 'Registration failed' })
            return { success: false, message: data.message || 'Registration failed' }
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return { success: true, user: data.user, token: data.token }
        } catch (err: any) {
          const message = err.message || 'Network error occurred'
          set({ isLoading: false, error: message })
          return { success: false, message }
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch {
          // ignore
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      checkAuth: async () => {
        const token = get().token
        if (!token) return

        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const data = await res.json()
          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true })
          } else {
            // Token might be expired
            set({ user: null, token: null, isAuthenticated: false })
          }
        } catch {
          // Keep cached state if offline
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'arka-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
