import { ScrollView, View, Text } from "react-native";
import { ChoosePageImage } from "./ChoosePageImage";
import { chapters } from "@/seed/chapters";
import { useChapterControl } from "@/store/ChapterControlContext";

interface Props {
  onPagePick: () => void
}

export function ChoosePageList({ onPagePick }: Props) {
  const { handleSlide } = useChapterControl();

  function handleChoosePage(chapterNum: number) {
    handleSlide(chapterNum - 1);
    onPagePick()
  }

  function pageByColumn(col: "left" | "right") {
    const rest = col === "left" ? 0 : 1;

    return chapters
      .filter((_, index) => index % 2 === rest)
      .map((manga) => (
        <ChoosePageImage
          key={manga.chapterNumber}
          img={manga.chapterImg}
          onPress={() => handleChoosePage(manga.chapterNumber)}
        />
      ));
  }

  return (
    <ScrollView className="bg-default-black p-6 pb-10">
      <Text className="font-semibold text-xl text-callout mb-2">Páginas</Text>
      <View className="flex-row  flex-1 gap-4 pb-10">
        <View className="flex-1">{pageByColumn("left")}</View>
        <View className="flex-1">{pageByColumn("right")}</View>
      </View>
    </ScrollView>
  );
}
