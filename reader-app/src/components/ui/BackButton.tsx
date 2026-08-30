import { Pressable } from 'react-native'
import Icon from '@react-native-vector-icons/material-design-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'

interface BackButtonProps {
  /** Fallback route when there's no history to pop (e.g. deep link). */
  fallbackHref?: Href
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// Floating back control for the manga detail screen. Returns to whatever screen
// pushed the detail (`router.back()`); the reader→detail case is already handled
// upstream by useBackToManga, so a plain back lands on the original source.
export default function BackButton({ fallbackHref = '/' }: BackButtonProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }]
  }))

  function handlePress() {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace(fallbackHref)
    }
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => scale.set(withTiming(0.88, { duration: 100 }))}
      onPressOut={() => scale.set(withTiming(1, { duration: 120 }))}
      hitSlop={12}
      style={[
        animatedStyle,
        { position: 'absolute', left: 16, top: insets.top + 10, zIndex: 20 }
      ]}
      className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
    >
      <Icon name="arrow-left" color="#ad89ff" size={26} />
    </AnimatedPressable>
  )
}
