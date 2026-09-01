import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "@react-native-vector-icons/material-design-icons";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChoosePageModal } from "./ChoosePageModal";
import { ReaderSettingsSheet } from "./ReaderSettingsSheet";
import { useChapterControl } from "@/store/ChapterControlContext";
import { useBookshelf } from "@/store/BookshelfStore";
import { ChapterAnimatedContainer } from "./ChapterAnimatedContainer";
import { useLocalSearchParams } from "expo-router";
import { useBackToManga } from "@/hooks/useBackToManga";

export function ChapterController() {
  const { totalPages, currentPage, handleSlide, pages, mode, setMode } =
    useChapterControl();
  const togglePageBookmark = useBookshelf((s) => s.togglePageBookmark);
  const insets = useSafeAreaInsets();
  const backToManga = useBackToManga();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { id, title, subtitle, mangaId, mangaName, chapterNumber } =
    useLocalSearchParams<{
      id?: string;
      title?: string;
      subtitle?: string;
      mangaId?: string;
      mangaName?: string;
      chapterNumber?: string;
    }>();

  const bookmarked = useBookshelf(
    (s) =>
      !!id &&
      s.pageBookmarks.some(
        (b) => b.chapterId === id && b.pageIndex === currentPage
      )
  );

  function handleToggleBookmark() {
    if (!id) return;

    togglePageBookmark({
      mangaId: mangaId ?? "",
      mangaName: mangaName ?? "",
      chapterId: id,
      chapterNumber: chapterNumber ?? "",
      chapterName: subtitle ?? "",
      pageIndex: currentPage,
      image: pages[currentPage]
    });
  }

  return (
    <>
      <ChapterAnimatedContainer>
        <View
          className="bg-[#262626] w-full p-4 rounded-b-lg top-0 flex-row px-4 items-center justify-between"
          style={{ paddingTop: insets.top + 10 }}
        >
          <View className="flex-row gap-4 items-center  w-3/4">
            <Pressable onPress={backToManga}>
              <Icon name={"arrow-left"} color={"#ad89ff"} size={26} />
            </Pressable>

            <View className="flex-1 pr-2">
              {subtitle ? (
                <Text className="text-white text-sm" numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
              <Text
                className="text-white font-semibold text-xl"
                numberOfLines={1}
              >
                {title ?? "Capítulo"}
              </Text>
            </View>
          </View>

          <Pressable onPress={() => setSettingsOpen(true)}>
            <Icon name={"cog-outline"} color={"#ad89ff"} size={24} />
          </Pressable>
        </View>

        <View
          pointerEvents="none"
          className="bg-black/80 h-32 w-32 rounded-full items-center justify-center self-center "
        >
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

          <Pressable onPress={handleToggleBookmark} className="ml-3">
            <Icon
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={28}
              color="#AD89FF"
            />
          </Pressable>

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

      <ReaderSettingsSheet
        visible={settingsOpen}
        mode={mode}
        onChangeMode={setMode}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
