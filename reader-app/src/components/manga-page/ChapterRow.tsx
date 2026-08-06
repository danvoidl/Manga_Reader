import { Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import Icon from '@react-native-vector-icons/material-design-icons'
import AppText from '../AppText'
import { langFlag } from '@/utils/lang'
import type { ChapterRow as ChapterRowType } from '@/types/manga'

interface Props {
  chapter: ChapterRowType
  mangaId?: string
  mangaName?: string
}

export function MangaPageChapter({ chapter, mangaId, mangaName }: Props) {
  const router = useRouter()

  const label = chapter.number ? `Cap. ${chapter.number}` : 'Oneshot'
  const heading = chapter.name ? `${label} — ${chapter.name}` : label

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/manga-chapter/[id]',
          params: {
            id: chapter.id,
            title: label,
            subtitle: chapter.name,
            mangaId,
            mangaName,
            chapterNumber: chapter.number
          }
        })
      }
      className="mx-6 mb-2 flex-row items-center justify-between rounded-lg bg-[#2f2f2f] px-4 py-3"
    >
      <View className="pr-3 w-[85%]">
        <AppText
          text={heading}
          className="mb-0.5 line-clamp-1 w-full text-ellipsis"
        />

        <View className="flex-row items-center gap-1">
          <Icon name="account-group-outline" size={14} color="#9ca3af" />
          <AppText
            size="xs"
            text={chapter.scan}
            className="text-gray-400 line-clamp-1"
          />
        </View>
      </View>

      <AppText text={langFlag(chapter.lang)} size="subtitle" className="" />
    </Pressable>
  )
}
