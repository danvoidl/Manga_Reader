import { FlatList, Linking, Pressable, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import Icon from '@react-native-vector-icons/material-design-icons'
import AppText from '@/components/AppText'
import ErrorState from '@/components/ui/ErrorState'
import { LatestChapterRowSkeleton } from '@/components/skeletons/MangaSkeletons'
import { useLatestChapters } from '@/hooks/useLatestChapters'
import { isExternalChapter } from '@/utils/manga'
import type { LatestChapterRow } from '@/types/manga'

function LatestChapterCard({ row }: { row: LatestChapterRow }) {
  const router = useRouter()
  const label = row.number ? `Cap. ${row.number}` : 'Oneshot'
  const external = isExternalChapter(row.externalUrl)

  function open() {
    // Official-publisher chapters open on the publisher's site, not the reader.
    if (isExternalChapter(row.externalUrl)) {
      Linking.openURL(row.externalUrl)
      return
    }

    router.push({
      pathname: '/manga/chapter/[id]',
      params: {
        id: row.chapterId,
        title: label,
        subtitle: row.title,
        mangaId: row.mangaId,
        mangaName: row.mangaName,
        chapterNumber: row.number
      }
    })
  }

  return (
    <Pressable style={{ width: 128 }} onPress={open}>
      <View>
        <Image
          source={row.cover}
          style={{ width: '100%', aspectRatio: 200 / 294, borderRadius: 6 }}
          contentFit="cover"
          transition={300}
        />
        {external && (
          <View className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1">
            <Icon name="open-in-new" size={14} color="#ffffff" />
          </View>
        )}
      </View>

      <AppText
        text={row.mangaName}
        size="sub"
        className="mt-1.5 font-bold leading-5 line-clamp-1"
      />
      <AppText text={label} size="xs" className="text-gray-300 line-clamp-1" />
      <AppText text={row.group} size="xs" className="text-gray-400 line-clamp-1" />
    </Pressable>
  )
}

export function LatestChaptersSection() {
  const { data, loading, error, refetch } = useLatestChapters(20)

  return (
    <View className="mt-6">
      <AppText
        text="Últimos capítulos adicionados"
        size="subtitle"
        className="mb-4 ml-6"
      />

      {loading && <LatestChapterRowSkeleton />}

      {!loading && error && (
        <ErrorState variant="inline" message={error} onRetry={refetch} />
      )}

      {!loading && !error && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.chapterId}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
          contentContainerStyle={{ paddingLeft: 22, paddingRight: 22 }}
          renderItem={({ item }) => <LatestChapterCard row={item} />}
        />
      )}
    </View>
  )
}
