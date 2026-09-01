import { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'
import {
  BottomSheetModal,
  BottomSheetScrollView
} from '@expo/ui/community/bottom-sheet'

import AppText from '@/components/AppText'
import { SelectableChip } from './SelectableChip'
import { useTags } from '@/hooks/useTags'
import { TAG_GROUP_LABELS, TAG_GROUP_ORDER } from '@/constants/exploreFilters'

interface Props {
  isPresented: boolean
  onDismiss: () => void
  selected: string[]
  onChange: (ids: string[]) => void
}

// Multi-select tag picker: tags fetched from the API and grouped client-side by
// their MangaDex `group` (genre / theme / format / content). Each tag is a
// selectable chip; groups are separated by a header. Uses the gorhom-compatible
// drop-in, so content is plain RN Views with real flex-wrap + scrolling.
export function TagSheet({ isPresented, onDismiss, selected, onChange }: Props) {
  const ref = useRef<BottomSheetModal>(null)
  const { data } = useTags()

  useEffect(() => {
    if (isPresented) ref.current?.present()
    else ref.current?.dismiss()
  }, [isPresented])

  const groups = useMemo(() => {
    const byGroup = new Map<string, typeof data>()

    for (const tag of data) {
      const group = tag.attributes?.group ?? 'other'
      if (!byGroup.has(group)) byGroup.set(group, [])
      byGroup.get(group)!.push(tag)
    }

    // Known groups first (in TAG_GROUP_ORDER), then any leftover groups.
    const keys = [
      ...TAG_GROUP_ORDER.filter((key) => byGroup.has(key)),
      ...[...byGroup.keys()].filter((key) => !TAG_GROUP_ORDER.includes(key))
    ]

    return keys.map((key) => ({
      key,
      label: TAG_GROUP_LABELS[key] ?? key,
      tags: byGroup.get(key)!
    }))
  }, [data])

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((tagId) => tagId !== id)
        : [...selected, id]
    )
  }

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onDismiss}
      snapPoints={['50%', '90%']}
      enablePanDownToClose
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <AppText text="Tags" size="subtitle" className="mb-4" />

        {groups.map((group) => (
          <View key={group.key} className="mb-5">
            <AppText
              text={group.label}
              size="sub"
              className="mb-2 font-bold text-[#AD89FF]"
            />

            <View className="flex-row flex-wrap gap-2">
              {group.tags.map((tag) => {
                const name =
                  tag.attributes?.name?.pt_br ?? tag.attributes?.name?.en ?? '—'

                return (
                  <SelectableChip
                    key={tag.id}
                    label={name}
                    selected={selected.includes(tag.id)}
                    onPress={() => toggle(tag.id)}
                  />
                )
              })}
            </View>
          </View>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}
