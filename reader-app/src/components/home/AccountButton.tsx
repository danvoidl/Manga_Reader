import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@react-native-vector-icons/material-design-icons";
import { useAuth } from "@/store/AuthContext";

// Floating account affordance. The app is behind a mandatory login gate, so the
// home is only ever reached while authenticated — tapping this logs out, which
// sends the user back to the login screen via the root guard.
export default function AccountButton() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading || !isAuthenticated) return null;

  return (
    <Pressable
      onPress={logout}
      hitSlop={12}
      accessibilityLabel="Sair"
      className="absolute right-5 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/40"
      style={{ top: insets.top + 8 }}
    >
      <Icon name="account-check" size={22} color="#FFFFFF" />
    </Pressable>
  );
}
