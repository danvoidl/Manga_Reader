import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/store/AuthContext";
import { ContinueReadingProvider } from "@/store/ContinueReadingContext";
import { queryClient } from "@/services/queryClient";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <AuthProvider>
            <ContinueReadingProvider>
              <StatusBar style="light" />

              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "#262626" },
                }}
              />
            </ContinueReadingProvider>
          </AuthProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
