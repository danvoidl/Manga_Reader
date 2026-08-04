import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/store/AuthContext";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AuthProvider>
          <StatusBar style="light" translucent />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#262626" },
            }}
          />
        </AuthProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
