import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { toMangaDetail } from '@/utils/manga'
import { MANGA_BY_ID_QUERY } from '@/services/manga'

// Fetches a single manga (cover, synopsis, tags) by id for the detail page.
// Backed by TanStack Query: results are cached per id (queryKey), deduped, and
// reused on remount — reopening the same manga is instant within staleTime.
// The public shape ({ data, loading, error }) is preserved so callers are
// unchanged; `select` runs the mapper on the cached response.
export function useMangaDetail(id?: string) {
  const query = useQuery({
    queryKey: ['mangaById', id],
    queryFn: () => gqlRequest(MANGA_BY_ID_QUERY, { id: id! }),
    enabled: !!id,
    select: (resp) => toMangaDetail(resp.manga)
  })

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error
      ? query.error instanceof Error
        ? query.error.message
        : 'Erro ao carregar mangá'
      : null,
    refetch: query.refetch
  }
}
