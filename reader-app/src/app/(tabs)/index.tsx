import { View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Board from '@/components/Board'
import AccountButton from '@/components/home/AccountButton'
import ContinueReadingSection from '@/components/home/ContinueReadingSection'
import { NewUpdatesSection } from '@/components/home/NewUpdatesSection'
import { ActionAdventureMangaSection } from '@/components/home/ActionAndAdventureSection'
import { RomanceSection } from '@/components/home/RomanceSection'
import { MostPopuparSection } from '@/components/home/MostPopularSection'

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

          <MostPopuparSection />

          <NewUpdatesSection />

          <ActionAdventureMangaSection />

          <RomanceSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
