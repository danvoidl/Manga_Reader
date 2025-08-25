import { View, Text, Pressable } from "react-native";
import Icon from "@react-native-vector-icons/material-design-icons";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChoosePageModal } from "./ChoosePageModal";
import { useChapterControl } from "@/store/ChapterControlContext";
import { ChapterAnimatedContainer } from "./ChapterAnimatedContainer";
import { useRouter } from "expo-router";

export function ChapterController() {
  const { totalPages, currentPage, handleSlide } = useChapterControl();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ChapterAnimatedContainer>
      <View
        className="bg-[#262626] w-full p-4 rounded-b-lg top-0 flex-row px-4 items-center justify-between"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row gap-4 items-center">
          <Pressable onPress={() => router.back()}>
            <Icon name={"arrow-left"} color={"#ad89ff"} size={26} />
          </Pressable>
          
          <View className="">
            <Text className="text-white text-sm">
              Erio and the Eletric Doll
            </Text>
            <Text className="text-white font-semibold text-xl">
              Capítulo 1 - Mechanical Angel
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-black/80 h-32 w-32 rounded-full items-center justify-center self-center ">
        <Text className="text-callout font-semibold text-xl">
          {currentPage + 1}
        </Text>
        <View className="h-[1px] bg-white w-[40%] my-2" />
        <Text className="text-white font-semibold text-xl">{totalPages}</Text>
      </View>

      <View
        className="bg-[#262626] w-full rounded-t-lg bottom-0 pt-4 px-4 flex-row items-center "
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <ChoosePageModal />

        <View className="flex-1 ">
          <Slider
            step={1}
            style={{ width: "100%" }}
            minimumValue={0}
            maximumValue={totalPages - 1}
            tapToSeek
            inverted
            maximumTrackTintColor={"#FFF"}
            thumbTintColor={"#AD89FF"}
            minimumTrackTintColor="#AD89FF"
            value={currentPage}
            onValueChange={handleSlide}
          />
        </View>
      </View>
    </ChapterAnimatedContainer>
  );
}
