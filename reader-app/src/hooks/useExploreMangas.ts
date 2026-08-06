import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { EXPLORE_MANGAS_QUERY } from '@/services/manga'
import type { MangaCover } from '@/types/manga'
import type { SortOption } from '@/constants/exploreFilters'
import { toMangaCovers } from '@/utils/manga'

interface UseExploreMangasArgs {
  title: string
  sorts: SortOption[]
  includedTags: string[]
  limit?: number
  debounceMs?: number
}

interface UseExploreMangasResult {
  data: MangaCover[]
  loading: boolean
  error: string | null
}

// Single data source for the Explore screen: combines the (debounced) title
// search, the selected sort criteria and the selected genre ids into one query.
export function useExploreMangas({
  title,
  sorts,
  includedTags,
  limit = 30,
  debounceMs = 400
}: UseExploreMangasArgs): UseExploreMangasResult {
  const term = title.trim()
  const [debounced, setDebounced] = useState(term)

  // Only hit the API when typing pauses (sort/genre changes apply immediately).
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term), debounceMs)
    return () => clearTimeout(timer)
  }, [term, debounceMs])

  const order = sorts.map((s) => ({ field: s.sort, direction: s.direction }))

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'exploreMangas',
      debounced,
      sorts.map((s) => s.key),
      includedTags,
      limit
    ],
    queryFn: () =>
      gqlRequest(EXPLORE_MANGAS_QUERY, {
        title: debounced || null,
        order,
        includedTags,
        limit
      }),
    select: (resp) => toMangaCovers(resp.mangas)
  })

  // Still-typing (term not yet debounced) counts as loading so the list doesn't
  // flash stale results between keystrokes.
  const typing = term.length > 0 && term !== debounced

  return {
    data: data ?? [],
    loading: typing || isLoading,
    error: error?.message ?? null
  }
}
