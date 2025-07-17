import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { blurhash } from "@/constants/general";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "./AppText";

interface Manga {
  id: string;
  cover: string;
  description: string;
  name: string;
}

export default function Banner({ item }: { item: Manga }) {
  const { width } = useWindowDimensions();

  return (
    <View style={[style.container, { width }]}>
      <Image
        style={style.banner}
        source={item.cover}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
        contentPosition={"top center"}
      />
      <LinearGradient
        colors={["transparent", "rgba(38,38,38,1)", "rgba(38,38,38,1)"]}
        style={style.background}
        locations={[0, 0.7, 1]}
      />
      <View className="absolute bottom-0 p-6 pb-12 bg-def">
        <AppText text={item.name} size="title" />
        <AppText
          text={item.description.replace(/[\s]{3,}/g, " ")}
          className="text-gray-300 text-sm line-clamp-3"
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flex: 1,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
});
