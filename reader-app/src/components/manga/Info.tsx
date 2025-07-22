import { View, useWindowDimensions } from "react-native";
import AppText from "../AppText";
import Chip from "../Chip";

interface Manga {
  id: string;
  cover: string;
  description: string;
  name: string;
}

interface MangaInfoProps {
  manga: Manga;
  resume?: boolean;
}

export default function MangaInfo({ manga, resume = false }: MangaInfoProps) {
  const { width } = useWindowDimensions();

  return (
    <View className={`z-10 pb-14`} style={{ marginTop: "88%", width }}>
      <AppText
        text={manga.name}
        size="title"
        className={`px-6 ${resume && "line-clamp-1"} `}
      />

      <View className="my-1 flex gap-1 flex-row px-6">
        <Chip text="ROMANCE" />
        <Chip text="COMEDY" />
        <Chip text="DRAMA" />
        <Chip text="SCHOOL LIFE" />
      </View>
      
      <AppText
        text={manga.description.replace(/[\s]{3,}/g, " ")}
        className={`text-gray-300 text-sm px-6 ${resume && "line-clamp-3"}`}
      />
    </View>
  );
}
