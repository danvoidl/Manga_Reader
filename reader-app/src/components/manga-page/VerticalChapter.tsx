import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";
import Icon from "@react-native-vector-icons/material-design-icons";

interface Chapter {
  chapterImg: string;
  chapterName: string;
  chapterNumber: number;
  scan: string;
}

export default function VerticalChapter({ chapter }: { chapter: Chapter }) {
  return (
    <View style={{ width: "48%", marginBottom: 16 }}>
      <View>
        <Image
          style={style.banner}
          source={chapter.chapterImg}
          contentFit="cover"
          transition={1000}
          contentPosition={"center"}
        />
      </View>

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
