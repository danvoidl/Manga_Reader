import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import AppText from "./AppText";

export default function LatestUpdate() {
  return (
    <View className="flex flex-row gap-4 items-center mt-2">
      <Image
        style={style.banner}
        source="https://mangadex.org/covers/d0f57b4a-8a11-4fc4-9d25-de9b0527eab8/e9d15539-2cb8-40a6-b487-dd6796e093a7.jpg.256.jpg"
        contentFit="fill"
        transition={1000}
        contentPosition={"center"}
        
      />

      <View className="grid gap-4">
        <AppText text="Splatoon" size="subtitle" />
        <AppText text="Vol. 9 Ch. 35 - Arowana Mall"  />
        <AppText text="3 minutes ago" />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  banner: {
    width: 84,
    height: 120,
    borderRadius: 4,
  },
});
