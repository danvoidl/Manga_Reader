import { Stack } from "expo-router";

// Unprotected group: the login gate and its help screen. `login` is the initial
// route, so a logged-out user always lands here first (the root layout only
// exposes this group while `!isAuthenticated`).
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#262626" },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="login-help" />
    </Stack>
  );
}
