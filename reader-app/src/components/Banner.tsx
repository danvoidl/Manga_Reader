import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { blurhash } from "@/constants/general";
import { LinearGradient } from "expo-linear-gradient";

export default function Banner({ cover }: { cover: string }) {
  const { width, height } = useWindowDimensions();
  const minHeight = height * 0.6;

  return (
    <View
      style={[
        {
          width,
          height: minHeight,
          position: "absolute",
        },
      ]}
    >
      <View className="relative w-full h-full">
        <Image
          style={{
            height: minHeight,
            width: "100%",
            backgroundColor: "yellow",
            position: "absolute",
          }}
          source={cover}
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

        <LinearGradient
          colors={[ "rgba(38,38,38,1)", "transparent"]}
          style={style.background2}
          locations={[0, 0.7, 1]}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
    zIndex: 1,
    elevation: 20,
  },
  background2: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 60,
    zIndex: 1,
    elevation: 20,
  },
});
