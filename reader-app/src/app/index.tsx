import AppText from "@/components/AppText";
import Board from "@/components/Board";
import Banner from "@/components/Banner";
import LatestUpdate from "@/components/LatestUpdate";
import VerticalManga from "@/components/VerticalManga";
import { mangaCovers } from "@/seed/mangas";
import { View, ScrollView } from "react-native";

export default function IndexScreen() {
  return (
    <ScrollView className=" flex-1  pb-60 bg-default-black">
      <View>
        <Board />
      </View>

      <View className="mb-14 px-6 pt-2">
        <View className="mt-6">
          <AppText text="Latest Updates" size="title" />
          {[...Array(4)].map((_, i) => (
            <LatestUpdate key={i} />
          ))}
        </View>

        <View className="mt-6">
          <AppText text="Highest Ranking" size="title" className="mb-4" />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mangaCovers.slice(0, 8).map((manga) => (
              <View style={{ marginRight: 30 }} key={manga.cover}>
                <VerticalManga coverUrl={manga.cover} mangaName={manga.name} />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}
