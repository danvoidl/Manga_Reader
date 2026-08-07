import { ActivityIndicator, useWindowDimensions, View } from 'react-native'
import { Pressable } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import AppText from '@/components/AppText'
import { useAdjacentChapters } from '@/hooks/useAdjacentChapters'
import { useBackToManga } from '@/hooks/useBackToManga'
import type { ChapterRow } from '@/types/manga'

interface Props {
  mangaId?: string
  mangaName?: string
  chapterId?: string
}

// Buttons use the gesture-handler Pressable (not RN's) so taps win arbitration
// against the surrounding Zoomable's single-tap (which toggles the bars).
// className isn't processed by NativeWind on this Pressable, so the container is
// styled inline; the label stays an AppText.
function ActionButton({
  title,
  onPress,
  variant = 'primary'
}: {
  title: string
  onPress: () => void
  variant?: 'primary' | 'ghost'
}) {
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: isPrimary ? '#AD89FF' : 'transparent'
      }}
    >
      <AppText
        text={title}
        className={
          isPrimary ? 'font-semibold text-[#1A1A1A]' : 'font-semibold text-callout'
        }
      />
    </Pressable>
  )
}

// Full-screen slide appended after the last page of a chapter. Offers moving to
// the next/previous chapter or back to the manga page.
export function EndOfChapter({ mangaId, mangaName, chapterId }: Props) {
  const { width } = useWindowDimensions()
  const router = useRouter()
  const backToManga = useBackToManga()
  const { next, prev, loading } = useAdjacentChapters(mangaId, chapterId)

  function goToChapter(chapter: ChapterRow) {
    const label = chapter.number ? `Cap. ${chapter.number}` : 'Oneshot'

    router.replace({
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

  return (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center gap-6 px-8"
    >
      <AppText
        text="Você chegou ao fim do capítulo"
        size="subtitle"
        className="text-center"
      />

      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <View className="w-full max-w-xs gap-3">
          {next ? (
            <ActionButton
              title={`Próximo capítulo${next.number ? ` — Cap. ${next.number}` : ''}`}
              onPress={() => goToChapter(next)}
            />
          ) : (
            <AppText
              text="Este é o capítulo mais recente."
              size="sub"
              className="text-center text-gray-400"
            />
          )}

          {prev ? (
            <ActionButton
              title="Capítulo anterior"
              variant="ghost"
              onPress={() => goToChapter(prev)}
            />
          ) : null}

          <ActionButton
            title="Voltar para o mangá"
            variant="ghost"
            onPress={backToManga}
          />
        </View>
      )}
    </View>
  )
}
