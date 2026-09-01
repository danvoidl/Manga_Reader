import { Pressable } from 'react-native'
import AppText from '@/components/AppText'
import { cn } from '@/utils/cn'

interface Props {
  label: string
  selected: boolean
  onPress: () => void
}

// Rounded pill that toggles between selected (accent fill) and unselected
// (neutral). Used inside the explore filter sheets, laid out with flex-wrap.
export function SelectableChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'rounded-full px-3 py-1.5',
        selected ? 'bg-[#AD89FF]' : 'bg-[#3F3F3F]'
      )}
    >
      <AppText
        text={label}
        size="sub"
        className={cn(
          'font-semibold',
          selected ? 'text-[#1A1A1A]' : 'text-white/70'
        )}
      />
    </Pressable>
  )
}
