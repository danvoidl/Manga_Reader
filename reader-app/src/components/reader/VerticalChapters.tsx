import { ReactNode, useCallback, useState } from 'react'
import {
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
  ViewToken,
  type ListRenderItemInfo
} from 'react-native'
import { Image, type ImageLoadEventData } from 'expo-image'
import { useSystemBars } from '@/store/SystemBarsContext'
import { useChapterControl } from '@/store/ChapterControlContext'

interface Props {
  endSlide?: ReactNode
}

const DEFAULT_ASPECT_RATIO = 0.7

function VerticalPageImage({ uri, onTap }: { uri: string; onTap: () => void }) {
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO)

  function handleLoad(event: ImageLoadEventData) {
    const { width, height } = event.source
    if (width && height) setAspectRatio(width / height)
  }

  return (
    <Pressable onPress={onTap}>
      <Image
        style={{ width: '100%', aspectRatio }}
        source={uri}
        contentFit="cover"
        transition={1000}
        onLoad={handleLoad}
      />
    </Pressable>
  )
}

// Continuous vertical scroll for Long Strip manga — full-width images, no
// pagination, no pinch-zoom (that's ZoomArea/HorizontalChapters only).
export function VerticalChapters({ endSlide }: Props) {
  const { toggleBars } = useSystemBars()
  const { pages, chapterListRef, handlePageChange, initialPage } =
    useChapterControl()
  const { height } = useWindowDimensions()

  const data = endSlide ? [...pages, '__end_slide__'] : pages

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstViewableIndex = viewableItems?.[0]?.index ?? null

      if (firstViewableIndex !== null && firstViewableIndex < pages.length)
        handlePageChange(firstViewableIndex)
    },
    [handlePageChange, pages.length]
  )

  function renderItem({ item, index }: ListRenderItemInfo<string>) {
    return index < pages.length ? (
      <VerticalPageImage uri={item} onTap={toggleBars} />
    ) : (
      <View style={{ minHeight: height }}>{endSlide}</View>
    )
  }

  return (
    <FlatList
      data={data}
      style={{ flex: 1 }}
      keyExtractor={(_, index) => index.toString()}
      ref={chapterListRef}
      initialScrollIndex={initialPage}
      onScrollToIndexFailed={(info) => {
        // No getItemLayout (page heights are unknown until loaded), so a jump
        // to a far index can fail on first try — retry with an approximate
        // offset, which self-corrects once real layout settles.
        setTimeout(() => {
          chapterListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false
          })
        }, 50)
      }}
      renderItem={renderItem}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  )
}
