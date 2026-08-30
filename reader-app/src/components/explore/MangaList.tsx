import { FlatList, useWindowDimensions, View } from 'react-native'
import AppText from '@/components/AppText'
import ErrorState from '@/components/ui/ErrorState'
import { ExploreGridSkeleton } from '@/components/skeletons/MangaSkeletons'
import { MangaCover } from '@/types/manga'
import { ExploreGridCard } from './GridCard'

interface Props {
  loading: boolean
  error: string | null
  mangas: MangaCover[]
  searching: boolean
  onRetry?: () => void
}

const COLUMNS = 3
const GAP = 12
const H_PADDING = 20

export function ExploreMangaList({
  error,
  loading,
  mangas,
  searching,
  onRetry
}: Props) {
  const { width: screenWidth } = useWindowDimensions()

  const cardWidth =
    (screenWidth - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS

  if (loading) {
    return (
      <View className="pt-1">
        <ExploreGridSkeleton width={cardWidth} />
      </View>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

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
