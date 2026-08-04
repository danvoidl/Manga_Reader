import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "@react-native-vector-icons/material-design-icons";
import { useAuth } from "@/store/AuthContext";

// Discreet, floating account affordance for the (optional) login. Tapping it
// opens the login screen when logged out, or logs out when logged in.
export default function AccountButton() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) return null;

  function handlePress() {
    if (isAuthenticated) {
      logout();
    } else {
      router.push("/login");
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={12}
      accessibilityLabel={isAuthenticated ? "Sair" : "Entrar"}
      className="absolute right-5 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/40"
      style={{ top: insets.top + 8 }}
    >
      <Icon
        name={isAuthenticated ? "account-check" : "account-outline"}
        size={22}
        color="#FFFFFF"
      />
    </Pressable>
  );
}
