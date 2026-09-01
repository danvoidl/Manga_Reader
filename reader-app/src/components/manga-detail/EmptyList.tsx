import AppText from '@/components/AppText'
import ErrorState from '@/components/ui/ErrorState'
import { ChapterListSkeleton } from '@/components/skeletons/MangaSkeletons'

interface Props {
  loading: boolean
  error: string | null
  onRetry?: () => void
}

export function MangaPageEmptyChapterList({ loading, error, onRetry }: Props) {
  if (loading) return <ChapterListSkeleton />

  if (error) return <ErrorState variant="inline" message={error} onRetry={onRetry} />

  return (
    <AppText
      text="Nenhum capítulo disponível."
      size="sub"
      className="px-6 text-gray-400"
    />
  )
}
