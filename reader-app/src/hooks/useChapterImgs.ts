import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { CHAPTER_IMGS_QUERY } from '@/services/manga'

interface UseChapterImgsResult {
  data: string[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Fetches the ordered page image URLs for a chapter (URLs built server-side).
export function useChapterImgs(chapterId?: string): UseChapterImgsResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['chapterImgs', chapterId],
    queryFn: () =>
      gqlRequest(CHAPTER_IMGS_QUERY, {
        chapterId: chapterId!
      }),
    enabled: !!chapterId,
    select: (resp) => resp.chapterImgs
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch
  }
}
