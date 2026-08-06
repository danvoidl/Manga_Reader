import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@continue-reading'
const MAX_ENTRIES = 10

// One row in the "Continuar lendo" carousel. `image` is a random page picked
// from the chapter at read time (used as the cover); `progress` is 0..1.
export interface ContinueReadingEntry {
  mangaId: string
  mangaName: string
  chapterId: string
  chapterNumber: string
  chapterName: string
  image: string
  progress: number
  readAt: number
}

// What the reader records when a chapter is opened (progress/readAt are derived).
type RecordInput = Omit<ContinueReadingEntry, 'progress' | 'readAt'>

interface CtxProps {
  entries: ContinueReadingEntry[]
  recordOpen: (entry: RecordInput) => void
  updateProgress: (chapterId: string, progress: number) => void
}

const ContinueReadingContext = createContext<CtxProps | undefined>(undefined)

export function useContinueReading() {
  const context = useContext(ContinueReadingContext)

  if (!context) {
    throw new Error(
      'useContinueReading deve ser usado dentro de um ContinueReadingProvider'
    )
  }

  return context
}

async function persist(entries: ContinueReadingEntry[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Best-effort: a failed local write shouldn't disrupt reading.
  }
}

export function ContinueReadingProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [entries, setEntries] = useState<ContinueReadingEntry[]>([])
  // Mirror of state so callbacks read the latest list without re-subscribing.
  const entriesRef = useRef<ContinueReadingEntry[]>([])

  const setAndPersist = useCallback((next: ContinueReadingEntry[]) => {
    entriesRef.current = next
    setEntries(next)
    persist(next)
  }, [])

  // Restore the saved list on startup.
  useEffect(() => {
    let active = true

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return
        const parsed = JSON.parse(raw) as ContinueReadingEntry[]
        if (Array.isArray(parsed)) {
          entriesRef.current = parsed
          setEntries(parsed)
        }
      })
      .catch(() => {
        // Ignore corrupt/missing storage — start from an empty list.
      })

    return () => {
      active = false
    }
  }, [])

  // Upsert 1-per-manga: drop any existing entry for this manga, put the new one
  // at the front, cap at MAX_ENTRIES.
  const recordOpen = useCallback(
    (entry: RecordInput) => {
      const next: ContinueReadingEntry[] = [
        { ...entry, progress: 0, readAt: Date.now() },
        ...entriesRef.current.filter((e) => e.mangaId !== entry.mangaId)
      ].slice(0, MAX_ENTRIES)

      setAndPersist(next)
    },
    [setAndPersist]
  )

  const updateProgress = useCallback(
    (chapterId: string, progress: number) => {
      let changed = false
      const next = entriesRef.current.map((e) => {
        if (e.chapterId !== chapterId) return e
        changed = true
        return { ...e, progress }
      })

      if (changed) setAndPersist(next)
    },
    [setAndPersist]
  )

  return (
    <ContinueReadingContext.Provider
      value={{ entries, recordOpen, updateProgress }}
    >
      {children}
    </ContinueReadingContext.Provider>
  )
}
