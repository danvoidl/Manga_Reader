import { useCallback } from 'react'
import { ActivityIndicator, BackHandler, Linking, Pressable, View } from 'react-native'
import Icon from '@react-native-vector-icons/material-design-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { ChapterController } from '@/components/reader/ChapterController'
import { SystemBarsProvider } from '@/store/SystemBarsContext'
import { ChapterControlProvider } from '@/store/ChapterControlContext'
import { Chapters } from '@/components/reader/Chapters'
import { EndOfChapter } from '@/components/reader/EndOfChapter'
import { ReadingTracker } from '@/components/reader/ReadingTracker'
import { useChapterImgs } from '@/hooks/useChapterImgs'
import { useChapter } from '@/hooks/useChapter'
import { useBackToManga } from '@/hooks/useBackToManga'
import { useMangaDetail } from '@/hooks/useMangaDetail'
import { useReadingMode } from '@/hooks/useReadingMode'
import { isExternalChapter } from '@/utils/manga'
import AppText from '@/components/AppText'
import Button from '@/components/ui/Button'
import ErrorState from '@/components/ui/ErrorState'

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
  const { data: pages, loading, error, refetch } = useChapterImgs(id)
  const { externalUrl, loading: chapterLoading } = useChapter(id)
  const { data: manga } = useMangaDetail(mangaId)
  const { mode, setMode } = useReadingMode(mangaId, manga?.tags)
  const backToManga = useBackToManga()
  const insets = useSafeAreaInsets()

  // Route the Android hardware back button through the same "always return to
  // the manga page" logic as the on-screen back arrow.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        backToManga()
        return true
      })
      return () => sub.remove()
    }, [backToManga])
  )

  const noPages = error || pages.length === 0
  const external = isExternalChapter(externalUrl)

  // Wait for both queries before deciding: the pages come back empty for
  // official-publisher chapters too, so don't flash the generic error while the
  // chapter metadata (which tells us it's external) is still loading.
  if (loading || (noPages && chapterLoading)) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  // Official-publisher chapter: MangaDex has no pages, so send the reader to the
  // publisher's site instead of the misleading "couldn't load pages" error.
  if (noPages && external) {
    return (
      <View className="flex-1">
        <Pressable
          onPress={backToManga}
          hitSlop={12}
          style={{ position: 'absolute', left: 16, top: insets.top + 10, zIndex: 20 }}
        >
          <Icon name="arrow-left" color="#ad89ff" size={26} />
        </Pressable>
        <View className="flex-1 items-center justify-center gap-6 px-8">
          <Icon name="open-in-new" color="#ad89ff" size={44} />
          <AppText
            text="Este capítulo está disponível no site oficial da editora."
            size="subtitle"
            className="text-center"
          />
          <Button
            title="Abrir no site oficial"
            icon="open-in-new"
            onPress={() => Linking.openURL(externalUrl)}
            className="w-full max-w-xs"
          />
        </View>
      </View>
    )
  }

  if (noPages) {
    return (
      <View className="flex-1">
        <Pressable
          onPress={backToManga}
          hitSlop={12}
          style={{ position: 'absolute', left: 16, top: insets.top + 10, zIndex: 20 }}
        >
          <Icon name="arrow-left" color="#ad89ff" size={26} />
        </Pressable>
        <ErrorState
          message={error ?? 'Não foi possível carregar as páginas.'}
          onRetry={refetch}
        />
      </View>
    )
  }

  return (
    <SystemBarsProvider>
      <View className="bg-black flex-1 relative">
        <ChapterControlProvider
          key={id}
          pages={pages}
          initialPage={Number(page) || 0}
          mode={mode}
          onChangeMode={setMode}
        >
          <Chapters
            endSlide={
              <EndOfChapter
                mangaId={mangaId}
                mangaName={mangaName}
                chapterId={id}
              />
            }
          />

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
