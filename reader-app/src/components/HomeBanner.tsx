import Banner from "./Banner";
import { View } from "react-native";
import MangaInfo from "./manga/Info";

interface Manga {
  id: string;
  cover: string;
  description: string;
  name: string;
}

export default function HomeBanner({ manga }: { manga: Manga }) {
  return (
    <View>
      <Banner cover={manga.cover} />

      <MangaInfo resume manga={manga} />
    </View>
  );
}
