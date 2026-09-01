import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { TOP_RATED_RECENT_QUERY } from '@/services/manga'
import type { MangaDetail } from '@/types/manga'
import { toMangaBanners } from '@/utils/manga'

interface UseMangaBannersResult {
  data: MangaDetail[]
  loading: boolean
  error: string | null
}

// Featured carousel (Board) — recently added titles (last 30 days), best rated.
export function useMangaBanners(limit = 8): UseMangaBannersResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mangaBanners', limit],
    queryFn: () => gqlRequest(TOP_RATED_RECENT_QUERY, { limit }),
    select: (resp) => toMangaBanners(resp.mangas)
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null
  }
}
