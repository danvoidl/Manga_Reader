import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { CHAPTER_QUERY } from '@/services/manga'

interface UseChapterResult {
  externalUrl: string | null
  loading: boolean
}

// Fetches a single chapter's metadata — used by the reader to detect
// official-publisher chapters (externalUrl set, no at-home pages) reached by
// any entry point and route to the external link instead of the broken reader.
export function useChapter(chapterId?: string): UseChapterResult {
  const { data, isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    enabled: !!chapterId,
    queryFn: () => gqlRequest(CHAPTER_QUERY, { id: chapterId! }),
    select: (resp) => resp.chapter?.attributes?.externalUrl ?? null
  })

  return {
    externalUrl: data ?? null,
    loading: isLoading
  }
}
