import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@react-native-vector-icons/material-design-icons";
import AppText from "@/components/AppText";
import Button from "@/components/ui/Button";
import { useAuth } from "@/store/AuthContext";

export default function ProfileScreen() {
  const { username, logout } = useAuth();

  function confirmLogout() {
    Alert.alert(
      "Sair da conta",
      "Você precisará entrar novamente com suas credenciais MangaDex. Seus dados salvos neste aparelho serão mantidos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            void logout();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="flex-1 px-6">
        <AppText text="Perfil" size="title" className="mb-8 mt-8" />

        <View className="flex-row items-center gap-4 rounded-xl bg-black/20 p-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-callout/20">
            <Icon name="account" size={26} color="#AD89FF" />
          </View>
          <View className="flex-1">
            <AppText
              text="Conectado como"
              size="xs"
              className="text-white/50"
            />
            <AppText
              text={username ?? "—"}
              size="text"
              className="font-semibold"
            />
          </View>
        </View>

        <View className="mt-auto mb-4">
          <Button
            title="Sair"
            variant="ghost"
            icon="logout"
            onPress={confirmLogout}
            className="border border-callout/40"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
