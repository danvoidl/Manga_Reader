import { gqlRequest } from '@/services/graphql'
import type { Manga, MangaCover } from '@/types/manga'
import { useQuery } from '@tanstack/react-query'
import { toMangaCovers } from '@/utils/manga'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

interface UseMangasResult {
  data: MangaCover[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Fetches a manga list from the GraphQL API. `query` must alias its root field
 * to `mangas` (see the queries in services/manga.ts).
 */
// Every list query aliases its root field to `mangas` and selects CardFields,
// so the result is always { mangas: Manga[] }. Typing the param as the codegen
// document lets gqlRequest infer everything — the wrong query won't compile.
type MangaListDocument = TypedDocumentNode<
  { mangas: Manga[] },
  { limit?: number | null }
>

export function useMangas(query: MangaListDocument, limit = 8): UseMangasResult {
  const { data, isLoading, error, refetch } = useQuery({
    // `limit` is part of the key: the same query at different limits (e.g. home
    // vs. Explore) must not share a cache entry.
    queryKey: ['mangas', query, limit],
    queryFn: () => gqlRequest(query, { limit }),
    select: (resp) => toMangaCovers(resp.mangas)
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch
  }
}
