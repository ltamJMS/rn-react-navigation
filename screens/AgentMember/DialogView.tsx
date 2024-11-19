import React, { useState } from 'react'
import Dialog from 'react-native-dialog'
import { ActivityIndicator, View } from 'react-native'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../../shared/constants'
enum DialogText {
  MakeACallTitle = 'Make a Call',
  LoginRequiredTitle = 'Agent Login Required',
  CallDescription = 'Do you want to Call by exten number?',
  LoginDescription = 'You are not logged in. Please login first.',
  CancelButton = 'Cancel',
  CallButton = 'Call',
  LoginButton = 'Agent Login'
}

interface DialogViewProps {
  visible: boolean
  onDismiss: () => void
  agentLoginStatus: boolean
}

const DialogView: React.FC<DialogViewProps> = ({
  visible,
  onDismiss,
  agentLoginStatus
}) => {
  const { handleRegisterSip, handleLogin } = useSoftPhone()
  const [loading, setLoading] = useState(false)

  const handleCallClick = () => {
    console.log('handleCallClick invoked')
    NavigationService.push(SCREENS.HOME)
    onDismiss()
  }
  let buttonLabel

  if (loading) {
    buttonLabel = <ActivityIndicator size="small" color="black" />
  } else if (agentLoginStatus) {
    buttonLabel = DialogText.CallButton
  } else {
    buttonLabel = DialogText.LoginButton
  }
  return (
    <View>
      <Dialog.Container visible={visible}>
        <Dialog.Title>
          {agentLoginStatus
            ? DialogText.MakeACallTitle
            : DialogText.LoginRequiredTitle}
        </Dialog.Title>
        <Dialog.Description>
          {agentLoginStatus
            ? DialogText.CallDescription
            : DialogText.LoginDescription}
        </Dialog.Description>
        <Dialog.Button
          label={DialogText.CancelButton}
          onPress={() => {
            console.log('click cancel')
            onDismiss()
          }}
        />
        <Dialog.Button
          label={buttonLabel}
          onPress={() => {
            if (agentLoginStatus) {
              handleCallClick()
            } else {
              setLoading(true)
              handleRegisterSip().then(() => {
                handleLogin(setLoading)
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
