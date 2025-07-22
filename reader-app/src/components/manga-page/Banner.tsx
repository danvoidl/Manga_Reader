import { View, Text } from "react-native";
import Banner from "../Banner";
import { mangaCovers } from "@/seed/mangas";
import MangaInfo from "../manga/Info";

export default function MangaPageBanner() {
  const manga = mangaCovers[1]
  
  return <View className="flex-1 max-h-max">
    <Banner cover={manga.cover} />
    <MangaInfo manga={manga} />
  </View>;
}
