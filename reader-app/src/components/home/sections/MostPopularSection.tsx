import MangaSection from '../MangaSection'
import { useMangas } from '@/hooks/useMangas'
import { HIGHEST_RANKING_QUERY } from '@/services/manga'

export function MostPopuparSection() {
  const highest = useMangas(HIGHEST_RANKING_QUERY, 12)

  return (
    <MangaSection
      title="Em alta"
      data={highest.data}
      loading={highest.loading}
      error={highest.error}
      ranked
    />
  )
}
