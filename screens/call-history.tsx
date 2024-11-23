import { DefaultError } from '@tanstack/react-query'
import React from 'react'
import { View } from 'react-native'
import { Button, SegmentedButtons } from 'react-native-paper'
import { DOMAINS } from '../constants'
import useMutation from '../hooks/useMutation'
import useBoundStore from '../stores'
import { ChangeStatusFormValues, LoginAgentFormValues } from '../types'
import { segmentedButtonsCalculator } from '../utils'

export default function CallHistory() {
  const statusText = useBoundStore(state => state.customer?.agentStatusText)
  const serverNumber = useBoundStore(state => state.user?.serverNumber)
  const sipAccount = useBoundStore(state => state.sipAccount)
  const currentAgent = useBoundStore(state => state.currentAgent)

  const status = `${currentAgent?.status}`
  const sipInfo = {
    sipaccount: sipAccount?.sipAccount,
    sippassword: sipAccount?.sipPassword,
    account: sipAccount?.agent?.agentAccount,
    password: sipAccount?.agent?.agentPassword
  }

  const { mutate: changeStatus } = useMutation<
    unknown,
    DefaultError,
    ChangeStatusFormValues
  >({
    endpoint: `/v1/ami/agent/status?serverNumber=${serverNumber}`
  })

  const { mutate: checkAgentLogin } = useMutation<
    unknown,
    DefaultError,
    Omit<LoginAgentFormValues, 'webrtcflg'>
  >({
    endpoint: `/infinitalk/agentstatus/logincheck?domain=https://${sipAccount?.domain}`,
    config: {
      baseURL: DOMAINS.API_GATEWAY_DOMAIN
    },
    onSuccess: () =>
      loginAgent({
        ...sipInfo,
        webrtcflg: 1
      })
  })

  const { mutate: loginAgent } = useMutation<
    unknown,
    DefaultError,
    LoginAgentFormValues
  >({
    endpoint: `/infinitalk/agentstatus/login?domain=https://${sipAccount?.domain}`,
    config: {
      baseURL: DOMAINS.API_GATEWAY_DOMAIN
    }
  })

  const buttons = segmentedButtonsCalculator(statusText)

  const handleStatusChange = (selectedValue: string) => {
    changeStatus({
      Action: 'QueuePause',
      Queue: currentAgent?.groupNames?.[0],
      Interface: currentAgent?.interface,
      Paused: selectedValue,
      Reason: selectedValue
    })
  }

  const handleLoginAgent = () => checkAgentLogin(sipInfo)

  return (
    <View className="flex-1 justify-center items-center">
      <Button mode="contained" onPress={handleLoginAgent}>
        Login Agent
      </Button>

      <SegmentedButtons
        style={{ flexWrap: 'wrap', paddingHorizontal: 10 }}
        value={status}
        onValueChange={handleStatusChange}
        theme={{ roundness: 0 }}
        buttons={buttons}
      />
    </View>
  )
}
