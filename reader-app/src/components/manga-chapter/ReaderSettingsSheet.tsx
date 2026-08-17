import { View } from 'react-native'
import { BottomSheet, Host, Column } from '@expo/ui'
import AppText from '@/components/AppText'
import { SelectableChip } from '@/components/explore/SelectableChip'
import type { ReadingMode } from '@/store/ReadingModeContext'

interface Props {
  visible: boolean
  mode: ReadingMode
  onChangeMode: (mode: ReadingMode) => void
  onClose: () => void
}

export function ReaderSettingsSheet({
  visible,
  mode,
  onChangeMode,
  onClose
}: Props) {
  return (
    <Host style={{ position: 'absolute' }}>
      <BottomSheet onDismiss={onClose} isPresented={visible}>
        <Column>
          <View className="px-6 py-4">
            <AppText text="Configurações de leitura" size="subtitle" />
          </View>

          <View className="gap-2 px-6 pb-8">
            <AppText text="Direção de leitura" size="sub" className="text-gray-400" />

            <View className="flex-row gap-2">
              <SelectableChip
                label="Horizontal"
                selected={mode === 'horizontal'}
                onPress={() => onChangeMode('horizontal')}
              />
              <SelectableChip
                label="Vertical"
                selected={mode === 'vertical'}
                onPress={() => onChangeMode('vertical')}
              />
            </View>
          </View>
        </Column>
      </BottomSheet>
    </Host>
  )
}
