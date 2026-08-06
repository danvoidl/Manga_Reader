import MangaSection from '../MangaSection'
import { useMangasByTag } from '@/hooks/useMangasByTag'
import { TAG_IDS } from '@/constants/general'

export function RomanceSection() {
  const romance = useMangasByTag([TAG_IDS.romance])

  return (
    <MangaSection
      title="Romance"
      data={romance.data}
      loading={romance.loading}
      error={romance.error}
    />
  )
}
