import { useState, type ComponentProps } from 'react'
import { Pressable, View } from 'react-native'
import Icon from '@react-native-vector-icons/material-design-icons'
import AppText from '@/components/AppText'
import { SortSheet } from './SortSheet'
import { TagSheet } from './TagSheet'
import type { SortOption } from '@/constants/exploreFilters'

interface Props {
  sorts: SortOption[]
  onChangeSorts: (options: SortOption[]) => void
  tags: string[]
  onChangeTags: (ids: string[]) => void
}

type IconName = ComponentProps<typeof Icon>['name']

interface GhostButtonProps {
  icon: IconName
  label: string
  count: number
  onPress: () => void
}

function GhostButton({ icon, label, count, onPress }: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2 rounded-lg border border-white/15 px-4 py-2"
    >
      <Icon name={icon} size={18} color="#AD89FF" />
      <AppText text={count > 0 ? `${label} · ${count}` : label} size="sub" />
    </Pressable>
  )
}

// Row of ghost buttons that open the sort / tag bottom sheets. Owns the sheets'
// visibility; selection state is lifted to the Explore screen.
export function FilterBar({ sorts, onChangeSorts, tags, onChangeTags }: Props) {
  const [sortOpen, setSortOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)

  return (
    <View className="flex-row gap-3 px-5 pb-3">
      <GhostButton
        icon="sort-variant"
        label="Ordenação"
        count={sorts.length}
        onPress={() => setSortOpen(true)}
      />
      <GhostButton
        icon="filter-variant"
        label="Tags"
        count={tags.length}
        onPress={() => setTagOpen(true)}
      />

      <SortSheet
        isPresented={sortOpen}
        onDismiss={() => setSortOpen(false)}
        selected={sorts}
        onChange={onChangeSorts}
      />
      <TagSheet
        isPresented={tagOpen}
        onDismiss={() => setTagOpen(false)}
        selected={tags}
        onChange={onChangeTags}
      />
    </View>
  )
}
