import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@reading-mode-overrides'

export type ReadingMode = 'horizontal' | 'vertical'

type OverridesMap = Record<string, ReadingMode>

interface CtxProps {
  getOverride: (mangaId: string) => ReadingMode | undefined
  setOverride: (mangaId: string, mode: ReadingMode) => void
}

const ReadingModeContext = createContext<CtxProps | undefined>(undefined)

export function useReadingModeOverrides() {
  const context = useContext(ReadingModeContext)

  if (!context) {
    throw new Error(
      'useReadingModeOverrides deve ser usado dentro de um ReadingModeProvider'
    )
  }

  return context
}

async function persist(overrides: OverridesMap) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Best-effort: a failed local write shouldn't disrupt reading.
  }
}

export function ReadingModeProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<OverridesMap>({})
  const overridesRef = useRef<OverridesMap>({})

  useEffect(() => {
    let active = true

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return
        const parsed = JSON.parse(raw) as OverridesMap
        if (parsed && typeof parsed === 'object') {
          overridesRef.current = parsed
          setOverrides(parsed)
        }
      })
      .catch(() => {
        // Ignore corrupt/missing storage — start from an empty map.
      })

    return () => {
      active = false
    }
  }, [])

  const getOverride = useCallback((mangaId: string) => {
    return overridesRef.current[mangaId]
  }, [])

  const setOverride = useCallback((mangaId: string, mode: ReadingMode) => {
    const next = { ...overridesRef.current, [mangaId]: mode }
    overridesRef.current = next
    setOverrides(next)
    persist(next)
  }, [])

  return (
    <ReadingModeContext.Provider value={{ getOverride, setOverride }}>
      {children}
    </ReadingModeContext.Provider>
  )
}
