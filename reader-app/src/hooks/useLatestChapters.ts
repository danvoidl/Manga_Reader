import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { LATEST_CHAPTERS_QUERY } from '@/services/manga'
import type { LatestChapterRow } from '@/types/manga'
import { toLatestChapterRows } from '@/utils/manga'

interface UseLatestChaptersResult {
  data: LatestChapterRow[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Home "Últimos capítulos adicionados" — global latest chapter uploads.
export function useLatestChapters(limit = 20): UseLatestChaptersResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['latestChapters', limit],
    queryFn: () => gqlRequest(LATEST_CHAPTERS_QUERY, { limit }),
    select: (resp) => toLatestChapterRows(resp.latestChapters)
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch
  }
}
