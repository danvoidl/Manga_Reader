import { Pressable } from 'react-native'
import { Image } from 'expo-image'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import AppText from '@/components/AppText'
import type { MangaCover } from '@/types/manga'
import { useRouter } from 'expo-router'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface Props {
  item: MangaCover
  width: number
}
export function ExploreGridCard({ item, width }: Props) {
  const router = useRouter()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }]
  }))

  return (
    <AnimatedPressable
      style={[{ width }, animatedStyle]}
      onPressIn={() => scale.set(withTiming(0.96, { duration: 100 }))}
      onPressOut={() => scale.set(withTiming(1, { duration: 120 }))}
      onPress={() =>
        item.id &&
        router.push({ pathname: '/manga/[id]', params: { id: item.id } })
      }
    >
      <Image
        source={item.cover}
        style={{ width, height: width * 1.47, borderRadius: 8 }}
        contentFit="cover"
        transition={300}
      />
      <AppText
        text={item.name}
        size="xs"
        className="mt-1 text-white line-clamp-2"
      />
    </AnimatedPressable>
  )
}
