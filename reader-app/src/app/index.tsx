import { mangaCovers2, mangaCovers3, mangaCovers4 } from "@/seed/mangas";
import { View, ScrollView, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "@/components/AppText";
import Board from "@/components/Board";
import VerticalManga from "@/components/VerticalManga";

export default function IndexScreen() {
  return (
    <SafeAreaView className="flex-1 " edges={["left", "right", "bottom"]}>
      <ScrollView className="flex-1">
        <View className="mb-6 h-[60vh] relative">
          <Board />
        </View>

        <View className="mb-14 ">
          <View className="mt-6">
            <AppText
              text="Latest Updates"
              size="subtitle"
              className="mb-4 ml-6"
            />
            <FlatList
              data={mangaCovers4.slice(0, 8)}
              ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
              contentContainerStyle={{ paddingLeft: 22, paddingRight: 22 }}
              renderItem={({ item }) => (
                <VerticalManga coverUrl={item.cover} mangaName={item.name} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View className="mt-6 ">
            <AppText
              text="Recently Added"
              size="subtitle"
              className="mb-4 ml-6"
            />
            <FlatList
              data={mangaCovers2.slice(0, 8)}
              contentContainerStyle={{ paddingLeft: 22, paddingRight: 22 }}
              ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
              renderItem={({ item, index }) => (
                <VerticalManga coverUrl={item.cover} mangaName={item.name} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View className="mt-6">
            <AppText
              text="Highest Ranking"
              size="subtitle"
              className="mb-4 ml-6"
            />
            <FlatList
              data={mangaCovers3.slice(0, 8)}
              ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
              contentContainerStyle={{ paddingLeft: 22, paddingRight: 22 }}
              renderItem={({ item }) => (
                <VerticalManga coverUrl={item.cover} mangaName={item.name} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    zIndex: 0,
    left: 0,
    right: 0,
    bottom: -170,
    height: 180,
  },
});
