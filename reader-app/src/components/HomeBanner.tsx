import Banner from "./Banner";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import MangaInfo from "./manga/Info";
import type { MangaDetail, MangaWithDetail } from "@/types/manga";

export default function HomeBanner({ manga }: { manga: MangaWithDetail }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/manga-page", params: { id: manga.id } })
      }
    >
      <Banner cover={manga.cover ?? ""} />
      <MangaInfo resume manga={manga} />
    </Pressable>
  );
}
