import { View } from "react-native";
import { ChapterController } from "@/components/manga-chapter/ChapterController";
import { SystemBarsProvider } from "@/store/SystemBarsContext";
import { ChapterControlProvider } from "@/store/ChapterControlContext";
import { Chapters } from "@/components/manga-chapter/Chapters";

export default function MangaChapter() {
  return (
    <SystemBarsProvider>
      <ChapterControlProvider>
        <View className="bg-black flex-1 relative">
          <Chapters />

          <ChapterController />
        </View>
      </ChapterControlProvider>
    </SystemBarsProvider>
  );
}
