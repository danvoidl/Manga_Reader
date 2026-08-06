import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { FEATURED_QUERY } from '@/services/manga'
import type { MangaDetail } from '@/types/manga'
import { toMangaBanners } from '@/utils/manga'

interface UseMangaBannersResult {
  data: MangaDetail[]
  loading: boolean
  error: string | null
}

// Featured carousel (Board) — highest ranking with synopsis + tags.
export function useMangaBanners(limit = 8): UseMangaBannersResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['mangaBanners', limit],
    queryFn: () => gqlRequest(FEATURED_QUERY, { limit }),
    select: (resp) => toMangaBanners(resp.mangas)
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null
  }
}
