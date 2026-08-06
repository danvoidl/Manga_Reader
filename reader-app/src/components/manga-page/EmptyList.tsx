import AppText from '@/components/AppText'
import { View, ActivityIndicator } from 'react-native'

interface Props {
  loading: boolean
  error: string | null
}

export function MangaPageEmptyChapterList({ loading, error }: Props) {
  if (loading)
    return (
      <View className="items-center py-8">
        <ActivityIndicator color="#ffffff" />
      </View>
    )

  if (error)
    return <AppText text={error} size="sub" className="px-6 text-red-400" />

  return (
    <AppText
      text="Nenhum capítulo disponível."
      size="sub"
      className="px-6 text-gray-400"
    />
  )
}
