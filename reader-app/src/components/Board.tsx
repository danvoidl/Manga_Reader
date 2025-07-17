import { mangaCovers } from "@/seed/mangas";
import { View, FlatList, Animated } from "react-native";
import Banner from "./Banner";
import { useRef, useState } from "react";
import BoardPaginator from "./BoardPaginator";

export default function Board() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemschanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef(null);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 3, position: "relative" }}>
        <FlatList
          data={mangaCovers.slice(0, 8)}
          renderItem={({ item }) => <Banner item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemschanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
        <BoardPaginator data={mangaCovers.slice(0, 8)} scrollX={scrollX} />
      </View>
    </View>
  );
}
