import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ReadingMode = 'horizontal' | 'vertical'

interface ReadingModeState {
  overrides: Record<string, ReadingMode>
  setOverride: (mangaId: string, mode: ReadingMode) => void
}

export const useReadingModeOverrides = create<ReadingModeState>()(
  persist(
    (set, get) => ({
      overrides: {},
      setOverride: (mangaId, mode) => {
        set({ overrides: { ...get().overrides, [mangaId]: mode } })
      }
    }),
    {
      name: '@reading-mode-overrides',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
