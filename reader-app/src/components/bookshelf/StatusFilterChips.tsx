import { View } from 'react-native'
import { SelectableChip } from '@/components/explore/SelectableChip'
import type { BookshelfStatus } from '@/store/BookshelfStore'

export type BookshelfFilter = BookshelfStatus | 'pages'

interface Props {
  filter: BookshelfFilter
  onChangeFilter: (filter: BookshelfFilter) => void
}

const OPTIONS: { filter: BookshelfFilter; label: string }[] = [
  { filter: 'want-to-read', label: 'Quero ler' },
  { filter: 'reading', label: 'Lendo' },
  { filter: 'read', label: 'Lido' },
  { filter: 'dropped', label: 'Abandonei' },
  { filter: 'pages', label: 'Páginas' }
]

export function StatusFilterChips({ filter, onChangeFilter }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2 px-5 pb-3">
      {OPTIONS.map((option) => (
        <SelectableChip
          key={option.filter}
          label={option.label}
          selected={filter === option.filter}
          onPress={() => onChangeFilter(option.filter)}
        />
      ))}
    </View>
  )
}
