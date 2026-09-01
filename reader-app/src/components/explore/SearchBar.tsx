import { Pressable, TextInput, View } from 'react-native'
import AppText from '@/components/AppText'
import Icon from '@react-native-vector-icons/material-design-icons'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  query: string
  onChangeQuery: Dispatch<SetStateAction<string>>
}
export function ExploreSearchBar({ query, onChangeQuery }: Props) {
  return (
    <View className="px-5 pb-3 pt-2">
      <AppText text="Explorar" size="title" className="mb-4" />

      <View className="flex-row items-center rounded-lg bg-[#3F3F3F] px-4">
        <Icon name="magnify" size={22} color="#FFFFFF99" />
        <TextInput
          className="h-12 flex-1 pl-2 text-base text-white"
          placeholder="Buscar mangá..."
          placeholderTextColor="#FFFFFF66"
          value={query}
          onChangeText={onChangeQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => onChangeQuery('')} hitSlop={10}>
            <Icon name="close-circle" size={20} color="#FFFFFF99" />
          </Pressable>
        )}
      </View>
    </View>
  )
}
