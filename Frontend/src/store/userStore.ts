// src/store/userStore.ts
import { create } from 'zustand'

interface UserState {
  accessToken: string | null
  isLoggedIn: boolean
  setAccessToken: (token: string | null) => void
  setIsLoggedIn: (value: boolean) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  isLoggedIn: !!localStorage.getItem('accessToken'),
  setAccessToken: (token) => {
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
    set({ accessToken: token, isLoggedIn: !!token })
  },
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  logout: () => {
    localStorage.removeItem('accessToken')
    set({ accessToken: null, isLoggedIn: false })
  },
}))
