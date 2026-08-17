import { isLongStrip } from '@/utils/manga'
import {
  useReadingModeOverrides,
  type ReadingMode
} from '@/store/ReadingModeStore'

// Effective reading mode: a saved per-manga override always wins; otherwise
// falls back to vertical for Long Strip manga, horizontal for everything else.
export function useReadingMode(mangaId: string | undefined, tags: string[] | undefined) {
  const override = useReadingModeOverrides((s) =>
    mangaId ? s.overrides[mangaId] : undefined
  )
  const setOverride = useReadingModeOverrides((s) => s.setOverride)

  const defaultMode: ReadingMode = isLongStrip(tags ?? []) ? 'vertical' : 'horizontal'
  const mode = override || defaultMode

  const setMode = (next: ReadingMode) => {
    if (mangaId) setOverride(mangaId, next)
  }

  return { mode, setMode }
}
