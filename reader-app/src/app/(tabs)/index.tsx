import { useCallback, useState } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Board from '@/components/home/Board'
import ContinueReadingSection from '@/components/home/sections/ContinueReadingSection'
import { LatestChaptersSection } from '@/components/home/sections/LatestChaptersSection'
import { ActionAdventureMangaSection } from '@/components/home/sections/ActionAndAdventureSection'
import { RomanceSection } from '@/components/home/sections/RomanceSection'
import HighestRanking from '@/components/home/HighestRanking'
import RecentlyAdded from '@/components/home/RecentlyAdded'
import { queryClient } from '@/services/queryClient'

export default function IndexScreen() {
  const insets = useSafeAreaInsets()
  const [refreshing, setRefreshing] = useState(false)

  // Pull-to-refresh: refetch every mounted home query (banners, rankings, genre
  // rows, recently added, latest chapters) at once. The promise resolves when
  // they all settle, so the spinner stays until the data is back.
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await queryClient.refetchQueries({ type: 'active' })
    } finally {
      setRefreshing(false)
    }
  }, [])

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#AD89FF"
            colors={['#AD89FF']}
            progressBackgroundColor="#000000"
            progressViewOffset={insets.top + 12}
          />
        }
      >
        <View className="mb-2 h-[55vh] relative">
          <Board />
        </View>

        <View className="mb-14">
          <ContinueReadingSection />

          <HighestRanking />

          <LatestChaptersSection />

          <ActionAdventureMangaSection />

          <RomanceSection />

          <RecentlyAdded />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
