import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  View,
  useWindowDimensions
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppText from '@/components/AppText'
import { useMangas } from '@/hooks/useMangas'
import { useMangaSearch } from '@/hooks/useMangaSearch'
import { HIGHEST_RANKING_QUERY } from '@/services/manga'
import { ExploreGridCard } from '@/components/explore/GridCard'
import { ExploreSearchBar } from '@/components/explore/SearchBar'

const GAP = 12
const H_PADDING = 20
const COLUMNS = 3

export default function ExploreScreen() {
  const { width: screenWidth } = useWindowDimensions()
  const [query, setQuery] = useState('')

  const search = useMangaSearch(query)
  const popular = useMangas(HIGHEST_RANKING_QUERY, 30)

  const searching = query.trim().length > 0
  const source = searching ? search : popular

  const cardWidth =
    (screenWidth - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <ExploreSearchBar query={query} onChangeQuery={setQuery} />

      {source.loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : source.error ? (
        <View className="flex-1 items-center justify-center px-6">
          <AppText
            text={source.error}
            size="sub"
            className="text-center text-red-400"
          />
        </View>
      ) : (
        <FlatList
          data={source.data}
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
      )}
    </SafeAreaView>
  )
}
