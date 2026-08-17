import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/store/AuthContext";
import { ContinueReadingProvider } from "@/store/ContinueReadingContext";
import { BookshelfProvider } from "@/store/BookshelfContext";
import { ReadingModeProvider } from "@/store/ReadingModeContext";
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
              <BookshelfProvider>
                <ReadingModeProvider>
                  <StatusBar style="light" />

                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: "#262626" },
                    }}
                  >
                    {/* Reader owns its own "back" (always returns to the manga
                        page), so the iOS swipe-back gesture is disabled here. */}
                    <Stack.Screen
                      name="manga-chapter"
                      options={{ gestureEnabled: false }}
                    />
                  </Stack>
                </ReadingModeProvider>
              </BookshelfProvider>
            </ContinueReadingProvider>
          </AuthProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
