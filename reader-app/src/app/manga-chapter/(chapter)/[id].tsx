import { View } from "react-native";
import { setStatusBarHidden } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { Image } from "expo-image";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { useEffect, useState, useCallback } from "react";

export default function MangaChapter() {
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    setStatusBarHidden(true);
    NavigationBar.setVisibilityAsync("hidden");

    return () => {
      setStatusBarHidden(false, "fade");
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  const toggleBars = useCallback(() => {
    const nextVisibility = !barsVisible;
    setBarsVisible(nextVisibility);

    setStatusBarHidden(nextVisibility);
    NavigationBar.setVisibilityAsync(nextVisibility ? "hidden" : "visible");
  }, [barsVisible]);

  return (
    <View className="bg-white flex-1">
      <Zoomable
        isDoubleTapEnabled
        isSingleTapEnabled
        maxScale={2}
        onSingleTap={toggleBars}
        onMagicTap={toggleBars}
      >
        <Image
          style={{ flex: 1 }}
          source={
            "https://cmdxd98sb0x3yprd.mangadex.network/data/cc7b493cc8286968b5cb378caf78e0c1/4-d211b0b671ecfd94bb963c2fd9ec8161811b7733a6377c1317c8aecf4eb178f4.jpg"
          }
          contentFit="contain"
          transition={1000}
          contentPosition={"center"}
        />
      </Zoomable>
    </View>
  );
}
