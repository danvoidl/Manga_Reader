import { useState } from 'react'
import { Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import AppText from '@/components/AppText'
import { blurhash } from '@/constants/general'
import { useBookshelf, type BookshelfEntry } from '@/store/BookshelfContext'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'

interface Props {
  item: BookshelfEntry
  width: number
}

export function BookshelfMangaCard({ item, width }: Props) {
  const router = useRouter()
  const { removeEntry } = useBookshelf()
  const [confirmVisible, setConfirmVisible] = useState(false)

  return (
    <>
      <Pressable
        style={{ width }}
        onPress={() =>
          router.push({ pathname: '/manga-page', params: { id: item.mangaId } })
        }
        onLongPress={() => setConfirmVisible(true)}
      >
        <Image
          source={item.cover}
          placeholder={{ blurhash }}
          cachePolicy="disk"
          style={{ width, height: width * 1.47, borderRadius: 8 }}
          contentFit="cover"
          transition={300}
        />
        <AppText
          text={item.mangaName}
          size="xs"
          className="mt-1 text-white line-clamp-2"
        />
      </Pressable>

      <ConfirmDeleteModal
        visible={confirmVisible}
        title="Remover da estante?"
        message={`"${item.mangaName}" será removido da sua estante.`}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false)
          removeEntry(item.mangaId)
        }}
      />
    </>
  )
}
