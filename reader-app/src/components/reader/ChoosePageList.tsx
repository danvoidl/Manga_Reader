import { ScrollView, View, Text } from "react-native";
import { ChoosePageImage } from "./ChoosePageImage";
import { useChapterControl } from "@/store/ChapterControlContext";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onPagePick: () => void;
}

export function ChoosePageList({ onPagePick }: Props) {
  const { pages, handleSlide } = useChapterControl();

  function handleChoosePage(pageIndex: number) {
    handleSlide(pageIndex, false);
    onPagePick();
  }

  function pageByColumn(col: "left" | "right") {
    const rest = col === "left" ? 0 : 1;

    return pages
      .map((img, index) => ({ img, index }))
      .filter(({ index }) => index % 2 === rest)
      .map(({ img, index }) => (
        <ChoosePageImage
          key={index}
          img={img}
          onPress={() => handleChoosePage(index)}
        />
      ));
  }

  return (
    <SafeAreaView edges={['top']}>
    <ScrollView className="bg-default-black p-6 pb-10">
      <Text className="font-semibold text-xl text-callout mb-2">Páginas</Text>
      <View className="flex-row  flex-1 gap-4 pb-10">
        <View className="flex-1">{pageByColumn("left")}</View>
        <View className="flex-1">{pageByColumn("right")}</View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
