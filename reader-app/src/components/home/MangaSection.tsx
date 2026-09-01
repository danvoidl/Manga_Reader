import { FlatList, View } from 'react-native'
import AppText from '@/components/AppText'
import VerticalManga from '@/components/VerticalManga'
import ErrorState from '@/components/ui/ErrorState'
import { MangaRowSkeleton } from '@/components/skeletons/MangaSkeletons'
import type { MangaCover } from '@/types/manga'

interface MangaSectionProps {
  title: string
  data: MangaCover[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  className?: string
  ranked?: boolean
}

export default function MangaSection({
  title,
  data,
  loading = false,
  error = null,
  onRetry,
  className = '',
  ranked = false
}: MangaSectionProps) {
  return (
    <View className={`mt-6 ${className}`}>
      <AppText text={title} size="subtitle" className="mb-4 ml-6" />

      {loading ? (
        <MangaRowSkeleton />
      ) : error ? (
        <ErrorState variant="inline" message={error} onRetry={onRetry} />
      ) : (
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
      )}
    </View>
  )
}
