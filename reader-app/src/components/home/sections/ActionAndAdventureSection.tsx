import MangaSection from '../MangaSection'
import { useMangasByTag } from '@/hooks/useMangasByTag'
import { TAG_IDS } from '@/constants/general'

export function ActionAdventureMangaSection() {
  const actionAdventure = useMangasByTag([TAG_IDS.action, TAG_IDS.adventure])

  return (
    <MangaSection
      title="Ação & Aventura"
      data={actionAdventure.data}
      loading={actionAdventure.loading}
      error={actionAdventure.error}
    />
  )
}
