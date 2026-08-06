import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExploreSearchBar } from '@/components/explore/SearchBar'
import { ExploreMangaList } from '@/components/explore/MangaList'
import { FilterBar } from '@/components/explore/FilterBar'
import { useExploreMangas } from '@/hooks/useExploreMangas'
import { DEFAULT_SORT, type SortOption } from '@/constants/exploreFilters'

export default function ExploreScreen() {
  const [query, setQuery] = useState('')
  const [sorts, setSorts] = useState<SortOption[]>([DEFAULT_SORT])
  const [tags, setTags] = useState<string[]>([])

  const { data, loading, error } = useExploreMangas({
    title: query,
    sorts,
    includedTags: tags,
    limit: 30
  })

  const searching = query.trim().length > 0

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <ExploreSearchBar query={query} onChangeQuery={setQuery} />

      <FilterBar
        sorts={sorts}
        onChangeSorts={setSorts}
        tags={tags}
        onChangeTags={setTags}
      />

      <ExploreMangaList
        mangas={data}
        error={error}
        loading={loading}
        searching={searching}
      />
    </SafeAreaView>
  )
}
