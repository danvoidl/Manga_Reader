import { useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { CHAPTERS_QUERY } from '@/services/manga'
import type { ChapterRow } from '@/types/manga'
import { toChapterRows } from '@/utils/manga'

interface UseChaptersResult {
  data: ChapterRow[]
  total: number
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
}

// Loads a manga's chapters in pages of `pageSize` (10 by default). Dedupe +
// language priority happen server-side; each page is sliced from the deduped
// list, so the next page's offset is simply how many rows we've loaded so far.
export function useChapters(
  mangaId?: string,
  pageSize = 10
): UseChaptersResult {
  const query = useInfiniteQuery({
    queryKey: ['chapters', mangaId, pageSize],
    enabled: !!mangaId,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      gqlRequest(CHAPTERS_QUERY, {
        mangaId: mangaId!,
        limit: pageSize,
        offset: pageParam
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((n, p) => n + p.chapters.items.length, 0)
      return loaded < lastPage.chapters.total ? loaded : undefined
    }
  })

  const data =
    query.data?.pages.flatMap((p) => toChapterRows(p.chapters.items)) ?? []
  const total = query.data?.pages[0]?.chapters.total ?? 0

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query
  
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    data,
    total,
    loading: query.isLoading,
    loadingMore: isFetchingNextPage,
    error: query.error?.message ?? null,
    hasMore: hasNextPage,
    loadMore
  }
}
