import { Pressable } from 'react-native'
import { Image } from 'expo-image'
import AppText from '@/components/AppText'
import type { MangaCover } from '@/types/manga'
import { useRouter } from "expo-router";

interface Props {
  item: MangaCover
  width: number
}
export function ExploreGridCard({ item, width }: Props) {
  const router = useRouter()
  
  return (
    <Pressable
      style={{ width }}
      onPress={() =>
        item.id &&
        router.push({ pathname: '/manga-page', params: { id: item.id } })
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
    </Pressable>
  )
}
