import { Modal, View } from 'react-native'
import AppText from '@/components/AppText'
import Button from '@/components/ui/Button'

interface Props {
  visible: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/70 px-8">
        <View className="w-full rounded-lg bg-[#2f2f2f] p-5">
          <AppText text={title} size="subtitle" />
          <AppText text={message} className="mt-2 text-gray-300" />

          <View className="mt-5 flex-row justify-end gap-3">
            <Button title="Cancelar" variant="ghost" onPress={onCancel} />
            <Button title="Remover" variant="primary" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
