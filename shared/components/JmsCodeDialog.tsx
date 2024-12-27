// JmsCodeDialog.tsx
import React from 'react'
import Dialog from 'react-native-dialog'

interface JmsCodeDialogProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (code: string) => void
}

const JmsCodeDialog: React.FC<JmsCodeDialogProps> = ({
  visible,
  onCancel,
  onSubmit
}) => {
  const [code, setCode] = React.useState('')

  const handleSubmit = () => {
    onSubmit(code)
  }

  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>認証コードを入力</Dialog.Title>
      <Dialog.Description>
        続行するには、認証コードを入力してください
      </Dialog.Description>
      <Dialog.Input
        onChangeText={setCode}
        value={code}
        placeholder="認証コード"
      />
      <Dialog.Button label="キャンセル" onPress={onCancel} />
      <Dialog.Button label="承認" onPress={handleSubmit} />
    </Dialog.Container>
  )
}

export default JmsCodeDialog
