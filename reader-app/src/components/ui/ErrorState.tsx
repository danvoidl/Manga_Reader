import { View } from 'react-native'
import AppText from '@/components/AppText'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface ErrorStateProps {
  /** Optional message; falls back to a generic one. */
  message?: string | null
  onRetry?: () => void
  /** `full` centers in the available space; `inline` sits left-aligned inside a row. */
  variant?: 'full' | 'inline'
  className?: string
}

const DEFAULT_MESSAGE = 'Algo deu errado ao carregar.'

// Shared error UI: a short message plus a "Tentar novamente" action wired to the
// query's refetch. Reuses the Button primitive (ghost variant).
export default function ErrorState({
  message,
  onRetry,
  variant = 'full',
  className
}: ErrorStateProps) {
  const isFull = variant === 'full'

  return (
    <View
      className={cn(
        isFull ? 'flex-1 items-center justify-center px-6' : 'px-6',
        className
      )}
    >
      <AppText
        text={message || DEFAULT_MESSAGE}
        size="sub"
        className={cn(
          'text-gray-300',
          isFull ? 'text-center' : 'text-left'
        )}
      />

      {onRetry ? (
        <Button
          title="Tentar novamente"
          variant="ghost"
          icon="refresh"
          onPress={onRetry}
          className={cn(isFull ? 'mt-3' : 'mt-1 self-start px-0')}
        />
      ) : null}
    </View>
  )
}
