import { ActivityIndicator, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { ChapterController } from '@/components/manga-chapter/ChapterController'
import { SystemBarsProvider } from '@/store/SystemBarsContext'
import { ChapterControlProvider } from '@/store/ChapterControlContext'
import { Chapters } from '@/components/manga-chapter/Chapters'
import { ReadingTracker } from '@/components/manga-chapter/ReadingTracker'
import { useChapterImgs } from '@/hooks/useChapterImgs'
import AppText from '@/components/AppText'

export default function MangaChapter() {
  const { id, mangaId, mangaName, chapterNumber, subtitle, page } =
    useLocalSearchParams<{
      id?: string
      mangaId?: string
      mangaName?: string
      chapterNumber?: string
      subtitle?: string
      page?: string
    }>()
  const { data: pages, loading, error } = useChapterImgs(id)

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  if (error || pages.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <AppText
          text={error ?? 'Não foi possível carregar as páginas.'}
          size="sub"
          className="text-center text-gray-300"
        />
      </View>
    )
  }

  return (
    <SystemBarsProvider>
      <View className="bg-black flex-1 relative">
        <ChapterControlProvider pages={pages} initialPage={Number(page) || 0}>
          <Chapters />

          <ChapterController />

          <ReadingTracker
            mangaId={mangaId}
            mangaName={mangaName}
            chapterId={id}
            chapterNumber={chapterNumber}
            chapterName={subtitle}
          />
        </ChapterControlProvider>
      </View>
    </SystemBarsProvider>
  )
}
