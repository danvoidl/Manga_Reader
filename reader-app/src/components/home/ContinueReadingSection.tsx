import { FlatList, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import AppText from "@/components/AppText";
import {
  useContinueReading,
  type ContinueReadingEntry,
} from "@/store/ContinueReadingContext";

function ContinueCard({ entry }: { entry: ContinueReadingEntry }) {
  const router = useRouter();
  const label = entry.chapterNumber ? `Cap. ${entry.chapterNumber}` : "Oneshot";

  return (
    <Pressable
      style={{ width: 132 }}
      onPress={() =>
        router.push({
          pathname: "/manga-chapter/[id]",
          params: {
            id: entry.chapterId,
            title: label,
            subtitle: entry.chapterName,
            mangaId: entry.mangaId,
            mangaName: entry.mangaName,
            chapterNumber: entry.chapterNumber,
          },
        })
      }
    >
      <Image
        source={entry.image}
        style={{ width: 132, height: 191, borderRadius: 10 }}
        contentFit="cover"
        transition={300}
      />

      <View className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/15">
        <View
          className="h-full rounded-full bg-callout"
          style={{ width: `${Math.round(entry.progress * 100)}%` }}
        />
      </View>

      <AppText
        text={entry.mangaName}
        size="sub"
        className="mt-1.5 font-bold line-clamp-1"
      />
      <AppText text={label} size="xs" className="text-gray-400" />
    </Pressable>
  );
}

export default function ContinueReadingSection() {
  const { entries } = useContinueReading();

  if (entries.length === 0) return null;

  return (
    <View className="mt-6">
      <AppText text="Continuar lendo" size="subtitle" className="mb-4 ml-6" />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.chapterId}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        contentContainerStyle={{ paddingLeft: 22, paddingRight: 22 }}
        renderItem={({ item }) => <ContinueCard entry={item} />}
      />
    </View>
  );
}
