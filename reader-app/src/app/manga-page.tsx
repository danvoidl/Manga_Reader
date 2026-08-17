import { useEffect, useRef, useState } from 'react'
import { FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMangaDetail } from '@/hooks/useMangaDetail'
import { useChapters, type ChapterOrder } from '@/hooks/useChapters'
import { MangaPageBanner } from '@/components/manga-page/Banner'
import { MangaPageChapter } from '@/components/manga-page/ChapterRow'
import { ChapterListControls } from '@/components/manga-page/ChapterListControls'
import AppText from '@/components/AppText'
import { MangaPageEmptyChapterList } from '@/components/manga-page/EmptyList'
import type { ChapterRow } from '@/types/manga'

const DEFAULT_PAGE_SIZE = 20

export default function MangaPage() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { data: manga } = useMangaDetail(id)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [order, setOrder] = useState<ChapterOrder>('desc')

  const {
    data: chapters,
    totalPages,
    loading,
    error
  } = useChapters(id, { page, pageSize, order })

  const listRef = useRef<FlatList<ChapterRow>>(null)

  // Jump back to the top whenever the visible page changes.
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [page])

  function handleToggleOrder() {
    setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
    setPage(1)
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size)
    setPage(1)
  }

  return (
    <SafeAreaView className="flex-1" edges={['bottom']}>
      <FlatList
        ref={listRef}
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
            {!loading && !error && chapters.length > 0 && (
              <ChapterListControls
                order={order}
                onToggleOrder={handleToggleOrder}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={() => (
          <MangaPageEmptyChapterList error={error} loading={loading} />
        )}
      />
    </SafeAreaView>
  )
}
