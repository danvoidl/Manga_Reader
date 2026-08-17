import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { CHAPTERS_QUERY } from '@/services/manga'
import type { ChapterRow } from '@/types/manga'
import { toChapterRows } from '@/utils/manga'

export type ChapterOrder = 'asc' | 'desc'

interface UseChaptersOptions {
  page: number
  pageSize: number
  order: ChapterOrder
}

interface UseChaptersResult {
  data: ChapterRow[]
  total: number
  totalPages: number
  loading: boolean
  isPlaceholder: boolean
  error: string | null
}

// Loads a single, discrete page of a manga's chapters. The server holds the full
// deduped list and returns the slice `offset..offset+pageSize`, so jumping to an
// arbitrary page is just a matter of the offset. `keepPreviousData` keeps the old
// page on screen while the next one loads (no blank flash between pages).
export function useChapters(
  mangaId: string | undefined,
  { page, pageSize, order }: UseChaptersOptions
): UseChaptersResult {
  const query = useQuery({
    queryKey: ['chapters', mangaId, page, pageSize, order],
    enabled: !!mangaId,
    placeholderData: keepPreviousData,
    queryFn: () =>
      gqlRequest(CHAPTERS_QUERY, {
        mangaId: mangaId!,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order
      })
  })

  const data = toChapterRows(query.data?.chapters.items ?? [])
  const total = query.data?.chapters.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return {
    data,
    total,
    totalPages,
    loading: query.isLoading,
    isPlaceholder: query.isPlaceholderData,
    error: query.error?.message ?? null
  }
}
