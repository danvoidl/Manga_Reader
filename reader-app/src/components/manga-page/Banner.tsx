import { View, useWindowDimensions } from 'react-native'
import Banner from '../home/Banner'
import MangaInfo from '../manga/Info'
import type { MangaDetail } from '@/types/manga'

interface Props {
  manga: MangaDetail | null
}

export function MangaPageBanner({ manga }: Props) {
  const { height } = useWindowDimensions()

  // Reserve the banner space while the detail is still loading.
  if (!manga) {
    return <View style={{ height: height * 0.6 }} />
  }

  return (
    <View className="relative" style={{ minHeight: height * 0.6 }}>
      <Banner cover={manga.cover ?? ''} />
      <MangaInfo manga={manga} resume />
    </View>
  )
}
