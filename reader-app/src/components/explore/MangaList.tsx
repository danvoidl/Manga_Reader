import {
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  View
} from 'react-native'
import AppText from '@/components/AppText'
import { MangaCover } from '@/types/manga'
import { ExploreGridCard } from './GridCard'

interface Props {
  loading: boolean
  error: string | null
  mangas: MangaCover[]
  searching: boolean
}

const COLUMNS = 3
const GAP = 12
const H_PADDING = 20

export function ExploreMangaList({ error, loading, mangas, searching }: Props) {
  const { width: screenWidth } = useWindowDimensions()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <AppText text={error} size="sub" className="text-center text-red-400" />
      </View>
    )
  }

  const cardWidth =
    (screenWidth - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS

  return (
    <FlatList
      data={mangas}
      keyExtractor={(item, index) => item.id ?? String(index)}
      numColumns={COLUMNS}
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={{
        paddingHorizontal: H_PADDING,
        paddingBottom: 24,
        gap: GAP
      }}
      renderItem={({ item }) => (
        <ExploreGridCard item={item} width={cardWidth} />
      )}
      ListEmptyComponent={
        searching ? (
          <AppText
            text="Nenhum resultado encontrado."
            size="sub"
            className="mt-10 text-center text-gray-400"
          />
        ) : null
      }
      keyboardShouldPersistTaps="handled"
    />
  )
}
