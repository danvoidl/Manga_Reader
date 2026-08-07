import { View, useWindowDimensions } from 'react-native'
import AppText from '../AppText'
import Chip from '../Chip'
import type { MangaDetail } from '@/types/manga'

interface MangaInfoProps {
  manga: MangaDetail
  resume?: boolean
}

const LEADING_RATINGS = ['suggestive']
const PRIORITY_TAGS = ['Gore', 'Sexual Violence']

export default function MangaInfo({ manga, resume = false }: MangaInfoProps) {
  const { width } = useWindowDimensions()

  const tags = manga.tags ?? []

  const ratingChip = LEADING_RATINGS.includes(manga.contentRating)
    ? ['Suggestive'] // capitalizado pra casar com o variant do Chip
    : []

  const priority = PRIORITY_TAGS.filter((tag) => tags.includes(tag))
  const rest = tags.filter((tag) => !PRIORITY_TAGS.includes(tag))

  const orderedTags = [...ratingChip, ...priority, ...rest]

  function selectChipVariant(tag: string) {
    const TAG = tag.toUpperCase()

    if (TAG === 'SUGGESTIVE') return 'suggestive'
    if (PRIORITY_TAGS.includes(tag)) return 'sensitive'

    return 'ghost'
  }

  return (
    <View className={`z-10 pb-14`} style={{ marginTop: '88%', width }}>
      <AppText
        text={manga.name}
        size="title"
        className={`px-6 ${resume && 'line-clamp-1'} `}
      />

      {orderedTags.length > 0 && (
        <View className="my-1 flex gap-1 flex-row flex-wrap px-6">
          {orderedTags.slice(0, 5).map((tag) => (
            <Chip
              key={tag}
              text={tag.toUpperCase()}
              variant={selectChipVariant(tag)}
            />
          ))}
        </View>
      )}

      <AppText
        text={manga.description.replace(/[\s]{3,}/g, ' ')}
        className={`text-gray-300 text-sm px-6 ${resume && 'line-clamp-4'}`}
      />
    </View>
  )
}
