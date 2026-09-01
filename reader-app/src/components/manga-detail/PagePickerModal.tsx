import { Modal, Pressable, View } from 'react-native'
import AppText from '@/components/AppText'
import { cn } from '@/utils/cn'
import { BottomSheet, Host, Column, ScrollView } from '@expo/ui'

interface Props {
  visible: boolean
  totalPages: number
  current: number
  onSelect: (page: number) => void
  onClose: () => void
}

export function PagePickerModal({
  visible,
  totalPages,
  current,
  onSelect,
  onClose
}: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <Host style={{ flex: 1 }}>
      <BottomSheet onDismiss={() => onClose()} isPresented={visible}>
        <Column>
          <View className="flex-row items-center justify-between px-6 py-4">
            <AppText text="Ir para a página" size="subtitle" />
          </View>

          <ScrollView style={{ padding: 24, paddingTop: 0 }}>
            <View className="flex-row flex-wrap gap-3">
              {pages.map((page) => {
                const selected = page === current

                return (
                  <Pressable
                    key={page}
                    onPress={() => onSelect(page)}
                    className={cn(
                      'h-12 w-12 items-center justify-center rounded-lg',
                      selected ? 'bg-[#AD89FF]' : 'bg-[#2f2f2f]'
                    )}
                  >
                    <AppText
                      text={String(page)}
                      className={cn(
                        'font-semibold',
                        selected ? 'text-[#1A1A1A]' : 'text-white'
                      )}
                    />
                  </Pressable>
                )
              })}
            </View>
          </ScrollView>
        </Column>
      </BottomSheet>
    </Host>
  )
}
