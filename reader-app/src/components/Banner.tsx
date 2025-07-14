import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { blurhash } from "@/constants/general";
import { LinearGradient } from "expo-linear-gradient";

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
        colors={["transparent", "rgba(0,0,0,1)"]}
        style={style.background}
      />
      <View className="absolute bottom-0 p-6 pb-12">
        <Text className="font-bold  text-2xl text-white">{item.name}</Text>
        <Text className="text-white text-sm line-clamp-3">
          {item.description}
        </Text>
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
    height: 300,
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
