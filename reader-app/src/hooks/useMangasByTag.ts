import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { MANGAS_BY_TAG_QUERY } from '@/services/manga'
import type { MangaCover } from '@/types/manga'
import { toMangaCovers } from '@/utils/manga'

interface UseMangasByTagResult {
  data: MangaCover[]
  loading: boolean
  error: string | null
}

export function useMangasByTag(
  includedTags: string[],
  limit = 12
): UseMangasByTagResult {
  const tagsKey = includedTags.join(',')

  const { data, isLoading, error } = useQuery({
    queryKey: ['mangasByTag', tagsKey, limit],
    queryFn: () => gqlRequest(MANGAS_BY_TAG_QUERY, { includedTags, limit }),
    select: (resp) => toMangaCovers(resp.mangas)
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null
  }
}
