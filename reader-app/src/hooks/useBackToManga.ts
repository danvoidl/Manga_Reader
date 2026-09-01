import { useCallback } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

// Returns a "go back" callback for the reader that always lands on the manga
// detail. The reader is reachable both from the detail (chapter list) and
// straight from home ("Continuar lendo").
//
// `dismissTo` dismisses screens until it reaches the manga detail (popping the
// reader off when it came from the detail), or replaces the reader with the
// detail when it isn't in the stack (the "Continuar lendo" flow). Either way
// the reader unmounts — so its hidden system bars are restored — and the stack
// ends as [home, /manga/[id]], so a further back goes home. Plain `navigate`
// pushed a duplicate detail on top, leaving the reader mounted (bars stayed
// hidden and a second back returned to the reader).
export function useBackToManga() {
  const router = useRouter()
  const { mangaId } = useLocalSearchParams<{ mangaId?: string }>()

  return useCallback(() => {
    if (mangaId) {
      router.dismissTo({ pathname: '/manga/[id]', params: { id: mangaId } })
    } else {
      router.back()
    }
  }, [mangaId, router])
}
