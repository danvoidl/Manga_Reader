import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ENTRIES_STORAGE_KEY = '@bookshelf-entries'
const PAGE_BOOKMARKS_STORAGE_KEY = '@bookshelf-page-bookmarks'

export type BookshelfStatus = 'want-to-read' | 'reading' | 'read' | 'dropped'

// One manga marked in the Estante. `cover`/`mangaName` are denormalized so the
// grid can render without hitting the API again.
export interface BookshelfEntry {
  mangaId: string
  mangaName: string
  cover?: string
  status: BookshelfStatus
  updatedAt: number
}

// A single saved page inside a chapter, grouped by `chapterId` on the Estante's
// "Páginas" view. `image` is the page URL at bookmark time, used as thumbnail.
export interface PageBookmarkEntry {
  mangaId: string
  mangaName: string
  chapterId: string
  chapterNumber: string
  chapterName: string
  pageIndex: number
  image: string
  bookmarkedAt: number
}

type StatusInput = { id: string; name: string; cover?: string }
type PageBookmarkInput = Omit<PageBookmarkEntry, 'bookmarkedAt'>

interface CtxProps {
  entries: BookshelfEntry[]
  getStatus: (mangaId: string) => BookshelfStatus | undefined
  setStatus: (manga: StatusInput, status: BookshelfStatus) => void
  removeEntry: (mangaId: string) => void

  pageBookmarks: PageBookmarkEntry[]
  isPageBookmarked: (chapterId: string, pageIndex: number) => boolean
  togglePageBookmark: (entry: PageBookmarkInput) => void
  removePageBookmark: (chapterId: string, pageIndex: number) => void
}

const BookshelfContext = createContext<CtxProps | undefined>(undefined)

export function useBookshelf() {
  const context = useContext(BookshelfContext)

  if (!context) {
    throw new Error('useBookshelf deve ser usado dentro de um BookshelfProvider')
  }

  return context
}

async function persist<T>(key: string, value: T[]) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Best-effort: a failed local write shouldn't disrupt the UI.
  }
}

export function BookshelfProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<BookshelfEntry[]>([])
  const entriesRef = useRef<BookshelfEntry[]>([])

  const [pageBookmarks, setPageBookmarks] = useState<PageBookmarkEntry[]>([])
  const pageBookmarksRef = useRef<PageBookmarkEntry[]>([])

  const setAndPersistEntries = useCallback((next: BookshelfEntry[]) => {
    entriesRef.current = next
    setEntries(next)
    persist(ENTRIES_STORAGE_KEY, next)
  }, [])

  const setAndPersistPageBookmarks = useCallback((next: PageBookmarkEntry[]) => {
    pageBookmarksRef.current = next
    setPageBookmarks(next)
    persist(PAGE_BOOKMARKS_STORAGE_KEY, next)
  }, [])

  // Restore both saved lists on startup.
  useEffect(() => {
    let active = true

    AsyncStorage.getItem(ENTRIES_STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return
        const parsed = JSON.parse(raw) as BookshelfEntry[]
        if (Array.isArray(parsed)) {
          entriesRef.current = parsed
          setEntries(parsed)
        }
      })
      .catch(() => {
        // Ignore corrupt/missing storage — start from an empty list.
      })

    AsyncStorage.getItem(PAGE_BOOKMARKS_STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return
        const parsed = JSON.parse(raw) as PageBookmarkEntry[]
        if (Array.isArray(parsed)) {
          pageBookmarksRef.current = parsed
          setPageBookmarks(parsed)
        }
      })
      .catch(() => {
        // Ignore corrupt/missing storage — start from an empty list.
      })

    return () => {
      active = false
    }
  }, [])

  const getStatus = useCallback((mangaId: string) => {
    return entriesRef.current.find((e) => e.mangaId === mangaId)?.status
  }, [])

  // Upsert 1-per-manga: switching status replaces the existing entry.
  const setStatus = useCallback(
    (manga: StatusInput, status: BookshelfStatus) => {
      const next: BookshelfEntry[] = [
        {
          mangaId: manga.id,
          mangaName: manga.name,
          cover: manga.cover,
          status,
          updatedAt: Date.now()
        },
        ...entriesRef.current.filter((e) => e.mangaId !== manga.id)
      ]

      setAndPersistEntries(next)
    },
    [setAndPersistEntries]
  )

  const removeEntry = useCallback(
    (mangaId: string) => {
      const next = entriesRef.current.filter((e) => e.mangaId !== mangaId)
      setAndPersistEntries(next)
    },
    [setAndPersistEntries]
  )

  const isPageBookmarked = useCallback((chapterId: string, pageIndex: number) => {
    return pageBookmarksRef.current.some(
      (b) => b.chapterId === chapterId && b.pageIndex === pageIndex
    )
  }, [])

  const togglePageBookmark = useCallback(
    (entry: PageBookmarkInput) => {
      const exists = pageBookmarksRef.current.some(
        (b) => b.chapterId === entry.chapterId && b.pageIndex === entry.pageIndex
      )

      const next = exists
        ? pageBookmarksRef.current.filter(
            (b) => !(b.chapterId === entry.chapterId && b.pageIndex === entry.pageIndex)
          )
        : [...pageBookmarksRef.current, { ...entry, bookmarkedAt: Date.now() }]

      setAndPersistPageBookmarks(next)
    },
    [setAndPersistPageBookmarks]
  )

  const removePageBookmark = useCallback(
    (chapterId: string, pageIndex: number) => {
      const next = pageBookmarksRef.current.filter(
        (b) => !(b.chapterId === chapterId && b.pageIndex === pageIndex)
      )
      setAndPersistPageBookmarks(next)
    },
    [setAndPersistPageBookmarks]
  )

  return (
    <BookshelfContext.Provider
      value={{
        entries,
        getStatus,
        setStatus,
        removeEntry,
        pageBookmarks,
        isPageBookmarked,
        togglePageBookmark,
        removePageBookmark
      }}
    >
      {children}
    </BookshelfContext.Provider>
  )
}
