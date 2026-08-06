import { ActivityIndicator, FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMangaDetail } from '@/hooks/useMangaDetail'
import { useChapters } from '@/hooks/useChapters'
import { MangaPageBanner } from '@/components/manga-page/Banner'
import { MangaPageChapter } from '@/components/manga-page/ChapterRow'
import AppText from '@/components/AppText'
import { MangaPageEmptyChapterList } from '@/components/manga-page/EmptyList'

export default function MangaPage() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { data: manga } = useMangaDetail(id)
  const {
    data: chapters,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore
  } = useChapters(id)

  return (
    <SafeAreaView className="flex-1" edges={['bottom']}>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MangaPageChapter
            chapter={item}
            mangaId={manga?.id}
            mangaName={manga?.name}
          />
        )}
        ListHeaderComponent={
          <View>
            <MangaPageBanner manga={manga} />
            <AppText text="Capítulos" size="subtitle" className="mb-3 px-6" />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={() => {
          if (hasMore) loadMore()
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <MangaPageEmptyChapterList error={error} loading={loading} />
        )}
        ListFooterComponent={
          loadingMore ? (
            <View className="items-center py-4">
              <ActivityIndicator color="#ffffff" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}
