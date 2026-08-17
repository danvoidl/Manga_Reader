import { View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Board from '@/components/home/Board'
import AccountButton from '@/components/home/AccountButton'
import ContinueReadingSection from '@/components/home/sections/ContinueReadingSection'
import { LatestChaptersSection } from '@/components/home/sections/LatestChaptersSection'
import { ActionAdventureMangaSection } from '@/components/home/sections/ActionAndAdventureSection'
import { RomanceSection } from '@/components/home/sections/RomanceSection'
import HighestRanking from '@/components/home/HighestRanking'
import RecentlyAdded from '@/components/home/RecentlyAdded'

export default function IndexScreen() {
  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <AccountButton />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
