import React, { useState } from 'react'
import Dialog from 'react-native-dialog'
import { ActivityIndicator, View } from 'react-native'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../../shared/constants'
import AgentStatus from '../../services/models/softPhone'
import { useRecoilState } from 'recoil'
import { callRequestState } from '../../services/store/softphone'

enum DialogText {
  CallDescription = '内線番号で電話をかけますか？',
  LoginDescription = '電話機が起動されていないようです。\n 起動してもよろしいでしょうか？',
  CancelButton = 'キャンセル',
  CallButton = '発信',
  LoginButton = 'OK'
}

interface DialogViewProps {
  visible: boolean
  onDismiss: () => void
  agentLoginStatus: boolean
  agent: AgentStatus | null
}

const DialogView: React.FC<DialogViewProps> = ({
  visible,
  onDismiss,
  agentLoginStatus,
  agent
}) => {
  const { handleRegisterSip, handleLogin } = useSoftPhone()
  const [loading, setLoading] = useState(false)
  const [, setCallRequest] = useRecoilState(callRequestState)
  const { handleCall } = useSoftPhone()

  const handleCallClick = (phoneNumber: string) => {
    if (phoneNumber) {
      setCallRequest({
        phoneNumber: phoneNumber,
        isOutbound: true
      })
      handleCall(phoneNumber)
      NavigationService.push(SCREENS.CALL_SCREEN)
      onDismiss()
    }
  }
  let buttonLabel

  if (loading) {
    buttonLabel = <ActivityIndicator size="small" color="#333" />
  } else if (agentLoginStatus) {
    buttonLabel = DialogText.CallButton
  } else {
    buttonLabel = DialogText.LoginButton
  }
  return (
    <View>
      <Dialog.Container visible={visible}>
        <Dialog.Description>
          {agentLoginStatus && agent
            ? `内線番号で電話をかけますか？\n \n ${agent.name} - ${agent.exten}`
            : DialogText.LoginDescription}
        </Dialog.Description>
        <Dialog.Button
          label={DialogText.CancelButton}
          onPress={() => {
            onDismiss()
          }}
        />
        <Dialog.Button
          label={buttonLabel}
          onPress={() => {
            if (agentLoginStatus && agent) {
              handleCallClick(agent?.exten || '')
            } else {
              setLoading(true)
              handleRegisterSip().then(() => {
                handleLogin(setLoading, 0)
                  .then(() => {
                    setLoading(false)
                  })
                  .catch(() => {
                    setLoading(false)
                    console.error(' LOGIN ERROR')
                  })
              })
            }
          }}
        />
      </Dialog.Container>
    </View>
  )
}

export default DialogView
