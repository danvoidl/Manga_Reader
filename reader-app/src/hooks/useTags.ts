import { gqlRequest } from '@/services/graphql'
import { useQuery } from '@tanstack/react-query'
import { TAG_QUERY } from '@/services/tags'

export function useTags() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tags', TAG_QUERY],
    queryFn: () => gqlRequest(TAG_QUERY),
    select: (resp) => resp.categories
  })

  return {
    data: data ?? [],
    loading: isLoading,
    error: error?.message ?? null
  }
}
