import { View } from "react-native";
import Banner from "../Banner";
import MangaInfo from "../manga/Info";
import { mangaCovers } from "@/seed/mangas";

export default function MangaPageBanner() {
  const manga = mangaCovers[1];

  return (
    <View className="flex-1">
      <Banner cover={manga.cover} />
      <MangaInfo manga={manga} />
    </View>
  );
}
