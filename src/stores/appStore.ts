import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppTab = 'decode' | 'generate' | 'keygen'
export type ThemeMode = 'light' | 'dark' | 'system'

interface AppState {
  theme: ThemeMode
  activeTab: AppTab
  historyDrawerOpen: boolean
  setTheme: (theme: ThemeMode) => void
  setActiveTab: (tab: AppTab) => void
  toggleHistoryDrawer: () => void
  setHistoryDrawerOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      activeTab: 'decode',
      historyDrawerOpen: false,
      setTheme: (theme) => set({ theme }),
      setActiveTab: (activeTab) => set({ activeTab }),
      toggleHistoryDrawer: () =>
        set((s) => ({ historyDrawerOpen: !s.historyDrawerOpen })),
      setHistoryDrawerOpen: (historyDrawerOpen) => set({ historyDrawerOpen }),
    }),
    { name: 'jwt-lab-app' }
  )
)
