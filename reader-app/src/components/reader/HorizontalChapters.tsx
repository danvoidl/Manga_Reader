import { ZoomArea } from "@/components/zoom/ZoomArea";
import { useSystemBars } from "@/store/SystemBarsContext";
import { useWindowDimensions, View, ViewToken } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useChapterControl } from "@/store/ChapterControlContext";
import { ReactNode, useCallback } from "react";

interface Props {
  endSlide?: ReactNode;
}

export function HorizontalChapters({ endSlide }: Props) {
  const { toggleBars } = useSystemBars();
  const { pages, chapterListRef, handlePageChange, initialPage } =
    useChapterControl();
  const { width } = useWindowDimensions();

  // Append a sentinel after the last page so the inverted list can render a
  // dedicated end-of-chapter slide once the reader swipes past the final page.
  const data = endSlide ? [...pages, "__end_slide__"] : pages;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstViewableIndex = viewableItems?.[0]?.index ?? null;

      // Ignore the end slide (index === pages.length) so the page counter and
      // slider stay pinned to the last real page.
      if (firstViewableIndex !== null && firstViewableIndex < pages.length)
        handlePageChange(firstViewableIndex);
    },
    [handlePageChange, pages.length]
  );

  return (
    <ZoomArea toggleBars={toggleBars}>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        inverted
        style={{ flex: 1 }}
        snapToAlignment="start"
        disableIntervalMomentum={true}
        ref={chapterListRef}
        initialScrollIndex={initialPage}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) =>
          index < pages.length ? (
            <Image
              style={{ flex: 1, width }}
              source={item}
              contentFit="contain"
              transition={1000}
              contentPosition={"center"}
            />
          ) : (
            <View style={{ width }}>{endSlide}</View>
          )
        }
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </ZoomArea>
  );
}
