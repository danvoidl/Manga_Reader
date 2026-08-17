import { useState } from 'react'
import { Modal, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@react-native-vector-icons/material-design-icons'
import AppText from '@/components/AppText'
import { useBookshelf, type BookshelfStatus } from '@/store/BookshelfStore'
import type { MangaDetail } from '@/types/manga'

interface Props {
  manga: MangaDetail
}

const OPTIONS: { status: BookshelfStatus; label: string }[] = [
  { status: 'want-to-read', label: 'Quero ler' },
  { status: 'reading', label: 'Lendo' },
  { status: 'read', label: 'Lido' },
  { status: 'dropped', label: 'Abandonei' }
]

const BUTTON_SIZE = 44
const BUTTON_MARGIN = 16

// Floats top-right over the cover banner, so it needs its own opaque
// background (not just the banner's gradient) to stay readable regardless of
// how bright/busy the cover art is.
export function BookshelfStatusButton({ manga }: Props) {
  const insets = useSafeAreaInsets()
  const current = useBookshelf(
    (s) => s.entries.find((e) => e.mangaId === manga.id)?.status
  )
  const setStatus = useBookshelf((s) => s.setStatus)
  const [open, setOpen] = useState(false)

  function handleSelect(status: BookshelfStatus) {
    setStatus({ id: manga.id, name: manga.name, cover: manga.cover }, status)
    setOpen(false)
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="absolute z-20 items-center justify-center rounded-full bg-black/70"
        style={{
          top: insets.top + 10,
          right: BUTTON_MARGIN,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE
        }}
      >
        <Icon
          name={current ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color={current ? '#AD89FF' : '#FFFFFF'}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setOpen(false)}>
          <View
            className="absolute w-48 overflow-hidden rounded-lg bg-[#2f2f2f]"
            style={{
              top: insets.top + 10 + BUTTON_SIZE + 6,
              right: BUTTON_MARGIN
            }}
          >
            {OPTIONS.map((option) => (
              <Pressable
                key={option.status}
                onPress={() => handleSelect(option.status)}
                className="flex-row items-center justify-between px-4 py-3"
              >
                <AppText
                  text={option.label}
                  size="sub"
                  className={current === option.status ? 'text-callout' : 'text-white'}
                />
                {current === option.status && (
                  <Icon name="check" size={18} color="#AD89FF" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
