import MangaSection from '../MangaSection'
import { useMangas } from '@/hooks/useMangas'
import { LATEST_UPDATES_QUERY } from '@/services/manga'

export function NewUpdatesSection() {
  const latest = useMangas(LATEST_UPDATES_QUERY, 12)

  return (
    <MangaSection
      title="Novos lançamentos"
      data={latest.data}
      loading={latest.loading}
      error={latest.error}
    />
  )
}
