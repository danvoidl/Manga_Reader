import { useState } from 'react'
import { Pressable, View } from 'react-native'
import Icon from '@react-native-vector-icons/material-design-icons'
import AppText from '@/components/AppText'
import { SelectableChip } from '@/components/explore/SelectableChip'
import type { ChapterOrder } from '@/hooks/useChapters'
import { cn } from '@/utils/cn'
import { PagePickerModal } from './PagePickerModal'

export const PAGE_SIZE_OPTIONS = [10, 20, 50]

interface Props {
  order: ChapterOrder
  onToggleOrder: () => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Toolbar shown above the chapter list: order toggle (first→last / last→first),
// a page-size selector, and a page navigator (prev/next arrows + a tappable
// "Página X/Y" that opens a grid to jump to any page).
export function ChapterListControls({
  order,
  onToggleOrder,
  pageSize,
  onPageSizeChange,
  page,
  totalPages,
  onPageChange
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false)

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <View className="mb-3 gap-3 px-6">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={onToggleOrder}
          className="flex-row items-center gap-1.5 rounded-lg bg-[#2f2f2f] px-3 py-2"
        >
          <Icon
            name={order === 'asc' ? 'sort-ascending' : 'sort-descending'}
            size={18}
            color="#AD89FF"
          />
          <AppText
            text={order === 'asc' ? 'Primeiro → último' : 'Último → primeiro'}
            size="sub"
            className="font-semibold text-white/80"
          />
        </Pressable>

        <View className="flex-row items-center gap-2">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectableChip
              key={size}
              label={String(size)}
              selected={size === pageSize}
              onPress={() => onPageSizeChange(size)}
            />
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => onPageChange(page - 1)}
          disabled={isFirst}
          hitSlop={8}
          className={cn(
            'rounded-lg bg-[#2f2f2f] p-2',
            isFirst && 'opacity-40'
          )}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </Pressable>

        <Pressable
          onPress={() => setPickerVisible(true)}
          className="flex-row items-center gap-1.5"
        >
          <AppText
            text={`Página ${page}/${totalPages}`}
            className="font-semibold"
          />
          <Icon name="view-grid-outline" size={18} color="#AD89FF" />
        </Pressable>

        <Pressable
          onPress={() => onPageChange(page + 1)}
          disabled={isLast}
          hitSlop={8}
          className={cn('rounded-lg bg-[#2f2f2f] p-2', isLast && 'opacity-40')}
        >
          <Icon name="chevron-right" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <PagePickerModal
        visible={pickerVisible}
        totalPages={totalPages}
        current={page}
        onSelect={(p) => {
          onPageChange(p)
          setPickerVisible(false)
        }}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  )
}
