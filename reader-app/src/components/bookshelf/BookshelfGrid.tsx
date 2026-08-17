import { FlatList, useWindowDimensions, View } from 'react-native'
import AppText from '@/components/AppText'
import type { BookshelfEntry } from '@/store/BookshelfContext'
import { BookshelfMangaCard } from './BookshelfMangaCard'

interface Props {
  entries: BookshelfEntry[]
}

const COLUMNS = 3
const GAP = 12
const H_PADDING = 20

export function BookshelfGrid({ entries }: Props) {
  const { width: screenWidth } = useWindowDimensions()

  const cardWidth =
    (screenWidth - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.mangaId}
      numColumns={COLUMNS}
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={{
        paddingHorizontal: H_PADDING,
        paddingBottom: 24,
        gap: GAP
      }}
      renderItem={({ item }) => (
        <BookshelfMangaCard item={item} width={cardWidth} />
      )}
      ListEmptyComponent={
        <View className="mt-10 px-6">
          <AppText
            text="Nenhum mangá nesta lista."
            size="sub"
            className="text-center text-gray-400"
          />
        </View>
      }
    />
  )
}
