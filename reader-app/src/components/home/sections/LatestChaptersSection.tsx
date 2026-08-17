import { ActivityIndicator, FlatList, Pressable, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import AppText from '@/components/AppText'
import { useLatestChapters } from '@/hooks/useLatestChapters'
import type { LatestChapterRow } from '@/types/manga'

function LatestChapterCard({ row }: { row: LatestChapterRow }) {
  const router = useRouter()
  const label = row.number ? `Cap. ${row.number}` : 'Oneshot'

  return (
    <Pressable
      style={{ width: 128 }}
      onPress={() =>
        router.push({
          pathname: '/manga-chapter/[id]',
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
    >
      <Image
        source={row.cover}
        style={{ width: '100%', aspectRatio: 200 / 294, borderRadius: 6 }}
        contentFit="cover"
        transition={300}
      />

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
  const { data, loading, error } = useLatestChapters(20)

  return (
    <View className="mt-6">
      <AppText
        text="Últimos capítulos adicionados"
        size="subtitle"
        className="mb-4 ml-6"
      />

      {loading && (
        <View className="h-[240px] items-center justify-center">
          <ActivityIndicator color="#ffffff" />
        </View>
      )}

      {error && (
        <AppText text={error} size="sub" className="ml-6 text-red-400" />
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
