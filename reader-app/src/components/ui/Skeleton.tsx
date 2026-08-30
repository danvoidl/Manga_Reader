import { useEffect } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  makeMutable,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { cn } from '@/utils/cn'

// A single shared pulse drives every Skeleton on screen. Creating one module
// mutable + one repeat loop (instead of one per instance) keeps the first paint
// cheap when the home renders dozens of placeholders at once. Each Skeleton just
// reads this value in its animated style.
const pulse = makeMutable(0.4)
let started = false

function ensurePulse() {
  if (started) return
  started = true
  pulse.set(
    withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    )
  )
}

interface SkeletonProps {
  className?: string
  style?: StyleProp<ViewStyle>
}

// Pulsing placeholder block used across loading states. Colour/radius come from
// `className`, dynamic dimensions (aspectRatio, computed widths) from `style`.
export default function Skeleton({ className, style }: SkeletonProps) {
  useEffect(() => {
    ensurePulse()
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.get() }))

  return (
    <Animated.View
      style={[animatedStyle, style]}
      className={cn('rounded-md bg-white/10', className)}
    />
  )
}
