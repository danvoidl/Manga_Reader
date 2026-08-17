import { Stack } from 'expo-router'

export default function MangaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#262626' }
      }}
    >
      {/* Reader owns its own "back" (always returns to the manga
          detail), so the iOS swipe-back gesture is disabled here —
          the detail screen keeps the normal gesture. */}
      <Stack.Screen
        name="chapter/[id]"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  )
}
