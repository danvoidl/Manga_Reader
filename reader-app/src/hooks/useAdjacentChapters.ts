import { useQuery } from '@tanstack/react-query'
import { gqlRequest } from '@/services/graphql'
import { ADJACENT_CHAPTERS_QUERY } from '@/services/manga'
import type { ChapterRow } from '@/types/manga'
import { toChapterRows } from '@/utils/manga'

interface UseAdjacentChaptersResult {
  next: ChapterRow | null
  prev: ChapterRow | null
  loading: boolean
}

// Fetches the chapters adjacent to `chapterId` (next to read / previous) so the
// end-of-chapter slide can offer navigation. Server resolves direction, so the
// client just maps the two items.
export function useAdjacentChapters(
  mangaId?: string,
  chapterId?: string
): UseAdjacentChaptersResult {
  const { data, isLoading } = useQuery({
    queryKey: ['adjacentChapters', mangaId, chapterId],
    enabled: !!mangaId && !!chapterId,
    queryFn: () =>
      gqlRequest(ADJACENT_CHAPTERS_QUERY, {
        mangaId: mangaId!,
        chapterId: chapterId!
      }),
    select: (resp) => ({
      next: resp.adjacentChapters.next
        ? toChapterRows([resp.adjacentChapters.next])[0]
        : null,
      prev: resp.adjacentChapters.prev
        ? toChapterRows([resp.adjacentChapters.prev])[0]
        : null
    })
  })

  return {
    next: data?.next ?? null,
    prev: data?.prev ?? null,
    loading: isLoading
  }
}
