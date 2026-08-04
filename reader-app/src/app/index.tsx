import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Board from "@/components/Board";
import AccountButton from "@/components/home/AccountButton";
import LatestUpdates from "@/components/home/LatestUpdates";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import HighestRanking from "@/components/home/HighestRanking";

export default function IndexScreen() {
  return (
    <SafeAreaView className="flex-1 " edges={["left", "right", "bottom"]}>
      <AccountButton />

      <ScrollView className="flex-1">
        <View className="mb-6 h-[60vh] relative">
          <Board />
        </View>

        <View className="mb-14 ">
          <LatestUpdates />
          <RecentlyAdded />
          <HighestRanking />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
