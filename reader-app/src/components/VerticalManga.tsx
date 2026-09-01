import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AppText from "./AppText";
import { useRouter } from "expo-router";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const defaultCover =
  "https://mangadex.org/covers/d0f57b4a-8a11-4fc4-9d25-de9b0527eab8/e9d15539-2cb8-40a6-b487-dd6796e093a7.jpg.256.jpg";

const defaultMangaName = "Nome do mangá";

interface VerticalMangaProps {
  coverUrl?: string;
  mangaName?: string;
  mangaId?: string;
  rank?: number;
}

export default function VerticalManga({
  coverUrl = defaultCover,
  mangaName = defaultMangaName,
  mangaId,
  rank,
}: VerticalMangaProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  function handlePress() {
    if (!mangaId) return;
    router.push({ pathname: "/manga/[id]", params: { id: mangaId } });
  }

  return (
    <View style={style.container}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => scale.set(withTiming(0.96, { duration: 100 }))}
        onPressOut={() => scale.set(withTiming(1, { duration: 120 }))}
        style={animatedStyle}
      >
        <Image
          style={style.mangaCover}
          source={coverUrl}
          contentFit="cover"
          transition={1000}
          contentPosition={"center"}
        />

        {rank != null && (
          <Text
            className="absolute bottom-1 left-1.5 font-extrabold text-5xl text-white"
            style={{
              textShadowColor: "rgba(0,0,0,0.7)",
              textShadowRadius: 8,
              textShadowOffset: { width: 0, height: 2 },
            }}
          >
            {rank}
          </Text>
        )}
      </AnimatedPressable>

      <AppText
        text={mangaName}
        className="mt-1 text-ellipsis leading-5 line-clamp-2"
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: 128,
    height: 240,
  },
  mangaCover: {
    height: undefined,
    width: "100%",
    borderRadius: 6,
    aspectRatio: 200 / 294,
  },
});
