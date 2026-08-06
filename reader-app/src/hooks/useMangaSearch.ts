import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { MANGAS_BY_NAME_QUERY } from '@/services/manga'
import type { MangaCover } from '@/types/manga'
import { toMangaCovers } from '@/utils/manga'

interface UseMangaSearchResult {
  data: MangaCover[]
  loading: boolean
  error: string | null
}

// Debounced title search. An empty query skips the request; a previously
// searched term resolves instantly from cache (no spinner).
export function useMangaSearch(
  query: string,
  limit = 30,
  debounceMs = 400
): UseMangaSearchResult {
  const term = query.trim()
  const [debounced, setDebounced] = useState(term)

  // Only hit the API when typing pauses.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term), debounceMs)
    return () => clearTimeout(timer)
  }, [term, debounceMs])

  const { data, isLoading, error } = useQuery({
    queryKey: ['mangaSearch', debounced, limit],
    queryFn: () =>
      gqlRequest(MANGAS_BY_NAME_QUERY, {
        mangaName: debounced,
        limit
      }),
    enabled: debounced.length > 0,
    select: (resp) => toMangaCovers(resp.mangas)
  })

  // Still-typing (term not yet debounced) counts as loading so the UI doesn't
  // show stale results between keystrokes.
  const typing = term.length > 0 && term !== debounced

  return {
    data: term.length === 0 ? [] : (data ?? []),
    loading: term.length > 0 && (typing || isLoading),
    error: error?.message ?? null
  }
}
