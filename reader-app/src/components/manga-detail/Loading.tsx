import { ActivityIndicator, View } from "react-native";

export function LoadingManga() {
  return (
    <View className="items-center py-8">
      <ActivityIndicator color="#ffffff" />
    </View>
  );
}
