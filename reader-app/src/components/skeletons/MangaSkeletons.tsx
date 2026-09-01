import { View } from 'react-native'
import Skeleton from '@/components/ui/Skeleton'

// Skeletons that mirror the real card dimensions so loading states reserve the
// exact space the content will take (no layout jump when data arrives).

// Mirrors VerticalManga (128 wide, cover aspectRatio 200/294 + 2 title lines).
export function VerticalMangaSkeleton() {
  return (
    <View style={{ width: 128 }}>
      <Skeleton style={{ width: '100%', aspectRatio: 200 / 294, borderRadius: 6 }} />
      <Skeleton className="mt-2 h-3" style={{ width: '90%' }} />
      <Skeleton className="mt-1.5 h-3" style={{ width: '55%' }} />
    </View>
  )
}

// Horizontal placeholder row for MangaSection carousels. Overflow is clipped so
// the fixed-width cards don't push the layout wider than the screen.
export function MangaRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 24,
        paddingLeft: 22,
        overflow: 'hidden'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <VerticalMangaSkeleton key={i} />
      ))}
    </View>
  )
}

// Mirrors LatestChapterCard (128 wide, cover + 3 text lines).
export function LatestChapterCardSkeleton() {
  return (
    <View style={{ width: 128 }}>
      <Skeleton style={{ width: '100%', aspectRatio: 200 / 294, borderRadius: 6 }} />
      <Skeleton className="mt-2 h-3.5" style={{ width: '90%' }} />
      <Skeleton className="mt-1.5 h-2.5" style={{ width: '45%' }} />
      <Skeleton className="mt-1 h-2.5" style={{ width: '70%' }} />
    </View>
  )
}

export function LatestChapterRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 24,
        paddingLeft: 22,
        overflow: 'hidden'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <LatestChapterCardSkeleton key={i} />
      ))}
    </View>
  )
}

// Grid placeholder for the Explore screen. Matches MangaList's 3-col layout
// (gap 12, horizontal padding 20) and card ratio (height = width * 1.47).
export function ExploreGridSkeleton({
  width,
  count = 12
}: {
  width: number
  count?: number
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 20
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ width }}>
          <Skeleton style={{ width, height: width * 1.47, borderRadius: 8 }} />
          <Skeleton className="mt-1.5 h-2.5" style={{ width: '85%' }} />
        </View>
      ))}
    </View>
  )
}

// Full-width row placeholder for the manga detail chapter list. Mirrors
// MangaPageChapter (rounded #2f2f2f row with two stacked text lines).
export function ChapterRowSkeleton() {
  return (
    <View className="mx-6 mb-2 rounded-lg bg-[#2f2f2f] px-4 py-3">
      <Skeleton className="h-4 bg-white/15" style={{ width: '70%' }} />
      <Skeleton className="mt-2 h-2.5" style={{ width: '35%' }} />
    </View>
  )
}

export function ChapterListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ChapterRowSkeleton key={i} />
      ))}
    </View>
  )
}

// Placeholder for the home Board/HomeBanner while the featured mangas load.
// Fills the Board's fixed-height container (h-[55vh]): a full-bleed cover block
// with the title / chips / synopsis lines faked near the bottom, matching where
// HomeBanner draws MangaInfo. Replaces the old centered spinner.
export function HomeBoardSkeleton() {
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Skeleton
        className="rounded-none bg-white/5"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="px-6 pb-14">
        <Skeleton className="h-7" style={{ width: '70%' }} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <Skeleton className="h-6 rounded-full" style={{ width: 72 }} />
          <Skeleton className="h-6 rounded-full" style={{ width: 88 }} />
          <Skeleton className="h-6 rounded-full" style={{ width: 60 }} />
        </View>
        <Skeleton className="mt-4 h-3" style={{ width: '100%' }} />
        <Skeleton className="mt-2 h-3" style={{ width: '92%' }} />
        <Skeleton className="mt-2 h-3" style={{ width: '75%' }} />
      </View>
    </View>
  )
}

// Placeholder for the manga detail banner while the manga loads: a tall cover
// block with the title / chip / synopsis lines faked near the bottom.
export function MangaDetailBannerSkeleton({ height }: { height: number }) {
  return (
    <View style={{ height, justifyContent: 'flex-end' }}>
      <Skeleton
        className="rounded-none bg-white/5"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}
      />
      <View className="px-6 pb-14">
        <Skeleton className="h-8" style={{ width: '75%' }} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Skeleton className="h-6 rounded-full" style={{ width: 72 }} />
          <Skeleton className="h-6 rounded-full" style={{ width: 88 }} />
          <Skeleton className="h-6 rounded-full" style={{ width: 64 }} />
        </View>
        <Skeleton className="mt-4 h-3" style={{ width: '100%' }} />
        <Skeleton className="mt-2 h-3" style={{ width: '95%' }} />
        <Skeleton className="mt-2 h-3" style={{ width: '80%' }} />
      </View>
    </View>
  )
}
