import { useMemo, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import AppText from '@/components/AppText'
import { useBookshelf, type PageBookmarkEntry } from '@/store/BookshelfContext'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'

interface Props {
  bookmarks: PageBookmarkEntry[]
}

interface ChapterGroup {
  chapterId: string
  mangaId: string
  mangaName: string
  chapterNumber: string
  chapterName: string
  pages: PageBookmarkEntry[]
}

function chapterHeading(chapterNumber: string, chapterName: string) {
  const label = chapterNumber ? `Cap. ${chapterNumber}` : 'Oneshot'
  return chapterName ? `${label} — ${chapterName}` : label
}

function PageThumbnail({ entry }: { entry: PageBookmarkEntry }) {
  const router = useRouter()
  const { removePageBookmark } = useBookshelf()
  const [confirmVisible, setConfirmVisible] = useState(false)

  return (
    <>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/manga-chapter/[id]',
            params: {
              id: entry.chapterId,
              title: entry.chapterNumber ? `Cap. ${entry.chapterNumber}` : 'Oneshot',
              subtitle: entry.chapterName,
              mangaId: entry.mangaId,
              mangaName: entry.mangaName,
              chapterNumber: entry.chapterNumber,
              page: String(entry.pageIndex)
            }
          })
        }
        onLongPress={() => setConfirmVisible(true)}
      >
        <Image
          source={entry.image}
          style={{ width: 72, height: 102, borderRadius: 6 }}
          contentFit="cover"
        />
        <AppText
          text={`Pág. ${entry.pageIndex + 1}`}
          size="xs"
          className="mt-1 text-center text-gray-400"
        />
      </Pressable>

      <ConfirmDeleteModal
        visible={confirmVisible}
        title="Remover página marcada?"
        message={`Página ${entry.pageIndex + 1} de ${chapterHeading(entry.chapterNumber, entry.chapterName)}.`}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false)
          removePageBookmark(entry.chapterId, entry.pageIndex)
        }}
      />
    </>
  )
}

export function PageBookmarksList({ bookmarks }: Props) {
  const groups = useMemo(() => {
    const byChapter = new Map<string, ChapterGroup>()

    for (const entry of bookmarks) {
      const existing = byChapter.get(entry.chapterId)
      if (existing) {
        existing.pages.push(entry)
        continue
      }

      byChapter.set(entry.chapterId, {
        chapterId: entry.chapterId,
        mangaId: entry.mangaId,
        mangaName: entry.mangaName,
        chapterNumber: entry.chapterNumber,
        chapterName: entry.chapterName,
        pages: [entry]
      })
    }

    return Array.from(byChapter.values()).map((group) => ({
      ...group,
      pages: group.pages.sort((a, b) => a.pageIndex - b.pageIndex)
    }))
  }, [bookmarks])

  return (
    <FlatList
      data={groups}
      keyExtractor={(group) => group.chapterId}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
      renderItem={({ item: group }) => (
        <View>
          <AppText
            text={group.mangaName}
            size="xs"
            className="text-gray-400"
          />
          <AppText
            text={chapterHeading(group.chapterNumber, group.chapterName)}
            className="mb-2"
          />

          <View className="flex-row flex-wrap gap-3">
            {group.pages.map((page) => (
              <PageThumbnail
                key={`${page.chapterId}-${page.pageIndex}`}
                entry={page}
              />
            ))}
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View className="mt-10 px-6">
          <AppText
            text="Nenhuma página marcada ainda."
            size="sub"
            className="text-center text-gray-400"
          />
        </View>
      }
    />
  )
}
