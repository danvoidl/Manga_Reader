import { View, useWindowDimensions } from "react-native";
import AppText from "../AppText";
import Chip from "../Chip";
import type { MangaDetail } from "@/types/manga";

interface MangaInfoProps {
  manga: MangaDetail;
  resume?: boolean;
}

export default function MangaInfo({ manga, resume = false }: MangaInfoProps) {
  const { width } = useWindowDimensions();

  // Show at most 4 genre chips to keep the banner tidy.
  const tags = (manga.tags ?? []).slice(0, 4);

  return (
    <View className={`z-10 pb-14`} style={{ marginTop: "88%", width }}>
      <AppText
        text={manga.name}
        size="title"
        className={`px-6 ${resume && "line-clamp-1"} `}
      />

      {tags.length > 0 && (
        <View className="my-1 flex gap-1 flex-row flex-wrap px-6">
          {tags.map((tag) => (
            <Chip key={tag} text={tag.toUpperCase()} />
          ))}
        </View>
      )}

      <AppText
        text={manga.description.replace(/[\s]{3,}/g, " ")}
        className={`text-gray-300 text-sm px-6 ${resume && "line-clamp-4"}`}
      />
    </View>
  );
}
