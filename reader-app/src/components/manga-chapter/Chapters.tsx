import { ZoomArea } from "@/components/zoom/ZoomArea";
import { useSystemBars } from "@/store/SystemBarsContext";
import { useWindowDimensions, ViewToken } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useChapterControl } from "@/store/ChapterControlContext";
import { useCallback } from "react";

export function Chapters() {
  const { toggleBars } = useSystemBars();
  const { pages, chapterListRef, handlePageChange } = useChapterControl();
  const { width } = useWindowDimensions();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstViewableIndex = viewableItems?.[0]?.index ?? null;

      if (firstViewableIndex !== null) handlePageChange(firstViewableIndex);
    },
    [handlePageChange]
  );

  return (
    <ZoomArea toggleBars={toggleBars}>
      <FlatList
        data={pages}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        inverted
        snapToAlignment="start"
        disableIntervalMomentum={true}
        ref={chapterListRef}
        renderItem={({ item }) => (
          <Image
            style={{ flex: 1, width }}
            source={item}
            contentFit="contain"
            transition={1000}
            contentPosition={"center"}
          />
        )}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </ZoomArea>
  );
}
