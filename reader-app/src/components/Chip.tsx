import { View } from 'react-native'
import { tv } from 'tailwind-variants'
import AppText from './AppText'

const chip = tv({
  base: 'p-0.5 px-2 max-w-fit !rounded-full text-white/60',
  variants: {
    variant: {
      suggestive: 'bg-orange-600',
      ghost: 'bg-[#3F3F3F]',
      sensitive: 'bg-red-600'
    },
    defaultVariants: {
      variant: 'ghost'
    }
  }
})

const chipText = tv({
  base: 'font-semibold',
  variants: {
    variant: {
      suggestive: 'text-white',
      ghost: 'text-white/60',
      sensitive: 'text-white'
    }
  }
})

interface ChipProps {
  text: string
  variant?: 'ghost' | 'suggestive' | 'sensitive'
}

export default function Chip({ text, variant = 'ghost' }: ChipProps) {
  return (
    <View className={chip({ variant })} style={{ alignSelf: 'flex-start' }}>
      <AppText size="xs" text={text} className={chipText({ variant })} />
    </View>
  )
}
