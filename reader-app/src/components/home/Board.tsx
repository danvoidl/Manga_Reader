import { View, FlatList, Animated } from "react-native";
import { useRef, useState } from "react";
import HomeBanner from "./HomeBanner";
import { HomeBoardSkeleton } from "@/components/skeletons/MangaSkeletons";
import { useMangaBanners } from "@/hooks/useMangaBanners";

export default function Board() {
  const { data, loading, error } = useMangaBanners(8);
  const [, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemschanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef(null);

  if (loading) return <HomeBoardSkeleton />;

  if (error || data.length === 0) {
    return <View className="flex-1" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 3, position: "relative" }}>
        <FlatList
          data={data}
          renderItem={({ item }) => <HomeBanner manga={item} />}
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
      </View>
    </View>
  );
}
