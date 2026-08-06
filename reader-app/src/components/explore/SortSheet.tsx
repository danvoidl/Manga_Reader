import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import {
  BottomSheetModal,
  BottomSheetView
} from '@expo/ui/community/bottom-sheet'

import AppText from '@/components/AppText'
import { SelectableChip } from './SelectableChip'
import { SORT_OPTIONS, type SortOption } from '@/constants/exploreFilters'

interface Props {
  isPresented: boolean
  onDismiss: () => void
  selected: SortOption[]
  onChange: (options: SortOption[]) => void
}

// Multi-select sort picker. Each SORT_OPTION is a selectable chip; several
// criteria combine into order[<field>]=<direction> on the query. Uses the
// gorhom-compatible drop-in, so content is plain RN Views (real flex-wrap).
export function SortSheet({ isPresented, onDismiss, selected, onChange }: Props) {
  const ref = useRef<BottomSheetModal>(null)

  useEffect(() => {
    if (isPresented) ref.current?.present()
    else ref.current?.dismiss()
  }, [isPresented])

  const toggle = (option: SortOption) => {
    onChange(
      selected.some((s) => s.key === option.key)
        ? selected.filter((s) => s.key !== option.key)
        : [...selected, option]
    )
  }

  return (
    <BottomSheetModal ref={ref} onDismiss={onDismiss} enablePanDownToClose>
      <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <AppText text="Ordenar por" size="subtitle" className="mb-4" />

        <View className="flex-row flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <SelectableChip
              key={option.key}
              label={option.label}
              selected={selected.some((s) => s.key === option.key)}
              onPress={() => toggle(option)}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}
