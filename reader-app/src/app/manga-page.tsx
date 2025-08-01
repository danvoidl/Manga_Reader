import { ScrollView, View, FlatList } from "react-native";
import MangaPageBanner from "@/components/manga-page/Banner";
import VerticalChapter from "@/components/manga-page/VerticalChapter";
import { chapters } from "@/seed/chapters";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "@/components/AppText";

export default function MangaPage() {
  return (
    <SafeAreaView className="flex-1" edges={['bottom']}>
      <ScrollView className="flex-1">
        <MangaPageBanner />

        <AppText text="Chapters" className="px-6" size="subtitle" />
        <View className="flex-1 flex-row flex-wrap justify-between grid grid-cols-2 p-6">
          {chapters.map((chapter) => {
            return (
              <VerticalChapter key={chapter.chapterNumber} chapter={chapter} />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
