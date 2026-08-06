import { ActivityIndicator, FlatList, View } from 'react-native'
import AppText from '@/components/AppText'
import VerticalManga from '@/components/VerticalManga'
import type { MangaCover } from '@/types/manga'

interface MangaSectionProps {
  title: string
  data: MangaCover[]
  loading?: boolean
  error?: string | null
  className?: string
  ranked?: boolean
}

export default function MangaSection({
  title,
  data,
  loading = false,
  error = null,
  className = '',
  ranked = false
}: MangaSectionProps) {
  if (loading)
    return (
      <View className="h-[240px] items-center justify-center">
        <ActivityIndicator color="#ffffff" />
      </View>
    )

  if (error)
    return <AppText text={error} size="sub" className="ml-6 text-red-400" />

  return (
    <View className={`mt-6 ${className}`}>
      <AppText text={title} size="subtitle" className="mb-4 ml-6" />

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ?? String(index)}
        ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
        contentContainerStyle={{ paddingLeft: 22, paddingRight: 22 }}
        renderItem={({ item, index }) => (
          <VerticalManga
            coverUrl={item.cover}
            mangaName={item.name}
            mangaId={item.id}
            rank={ranked ? index + 1 : undefined}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}
