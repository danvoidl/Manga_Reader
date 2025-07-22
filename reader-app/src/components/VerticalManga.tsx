import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import AppText from "./AppText";
import { useRouter } from "expo-router";

const defaultCover =
  "https://mangadex.org/covers/d0f57b4a-8a11-4fc4-9d25-de9b0527eab8/e9d15539-2cb8-40a6-b487-dd6796e093a7.jpg.256.jpg";

const defaultMangaName = "Nome do mangá";

export default function VerticalManga({
  coverUrl = defaultCover,
  mangaName = defaultMangaName,
}) {
  const router = useRouter();

  function presss() {
    console.log("Press");
    router.push("/manga-page");
  }

  return (
    <View style={style.container}>
      <TouchableOpacity onPress={presss}>
        <Image
          style={style.mangaCover}
          source={coverUrl}
          contentFit="cover"
          transition={1000}
          contentPosition={"center"}
        />
      </TouchableOpacity>

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
