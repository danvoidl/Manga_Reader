import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "../AppText";
import Icon from "@react-native-vector-icons/material-design-icons";
import { useRouter } from "expo-router";

interface Chapter {
  chapterImg: string;
  chapterName: string;
  chapterNumber: number;
  scan: string;
}

export default function VerticalChapter({ chapter }: { chapter: Chapter }) {
  const router = useRouter()
  
  return (
    <View style={{ width: "48%", marginBottom: 16 }}>
      <Pressable onPress={() => router.push('/manga-chapter/id')}>
        <Image
          style={style.banner}
          source={chapter.chapterImg}
          contentFit="cover"
          transition={1000}
          contentPosition={"center"}
        />
      </Pressable>

      <View className="mt-2">
        <AppText text={`${chapter.chapterName} #${chapter.chapterNumber}`} />

        <View className="flex flex-row gap-1 items-center">
          <Icon name="account-group-outline" size={14} color={"#9ca3af"} />
          <AppText size="xs" text={chapter.scan} className="text-gray-400" />
        </View>
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
    height: 240,
    resizeMode: "center",
  },
});
