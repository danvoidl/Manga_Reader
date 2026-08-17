import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppText from '@/components/AppText'
import { BookshelfGrid } from '@/components/bookshelf/BookshelfGrid'
import { PageBookmarksList } from '@/components/bookshelf/PageBookmarksList'
import {
  StatusFilterChips,
  type BookshelfFilter
} from '@/components/bookshelf/StatusFilterChips'
import { useBookshelf } from '@/store/BookshelfContext'

export default function BookshelfScreen() {
  const [filter, setFilter] = useState<BookshelfFilter>('want-to-read')
  const { entries, pageBookmarks } = useBookshelf()

  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <AppText text="Estante" size="title" className="px-5 pb-3" />

      <StatusFilterChips filter={filter} onChangeFilter={setFilter} />

      {filter === 'pages' ? (
        <PageBookmarksList bookmarks={pageBookmarks} />
      ) : (
        <BookshelfGrid entries={entries.filter((e) => e.status === filter)} />
      )}
    </SafeAreaView>
  )
}
