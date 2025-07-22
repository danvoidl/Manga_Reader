import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { blurhash } from "@/constants/general";
import { LinearGradient } from "expo-linear-gradient";

interface Manga {
  id: string;
  cover: string;
  description: string;
  name: string;
}

export default function OnlyImageBanner({ item }: { item: Manga }) {
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
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flex: 1,
    backgroundColor: "yellow",
  },
  banner: {
    width: "100%",
    height: undefined,
    aspectRatio: 2/3,
    maxHeight: "60%",
    resizeMode: "cover"
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
});
