import { DefaultError } from '@tanstack/react-query'
import React from 'react'
import { View } from 'react-native'
import {
  ActivityIndicator,
  Button,
  Dialog,
  SegmentedButtons
} from 'react-native-paper'
import { DOMAINS } from '../constants'
import useMutation from '../hooks/useMutation'
import useBoundStore from '../stores'
import { ChangeStatusFormValues, LoginAgentFormValues } from '../types'
import { encodeFormData, segmentedButtonsCalculator } from '../utils'

export default function CallHistory() {
  const statusText = useBoundStore(state => state.customer?.agentStatusText)
  const serverNumber = useBoundStore(state => state.user?.serverNumber)
  const sipAccount = useBoundStore(state => state.sipAccount)
  const currentAgent = useBoundStore(state => state.currentAgent)
  const softPhone = useBoundStore(state => state.softPhone)

  const status = `${currentAgent?.status}`
  const sipInfo = {
    sipaccount: sipAccount?.sipAccount,
    sippassword: sipAccount?.sipPassword,
    account: sipAccount?.agent?.agentAccount,
    password: sipAccount?.agent?.agentPassword
  }

  const { isPending, mutate: changeStatus } = useMutation<
    unknown,
    DefaultError,
    ChangeStatusFormValues
  >({
    endpoint: `/v1/ami/agent/status?serverNumber=${serverNumber}`
  })

  const { mutate: checkAgentLogin } = useMutation<
    unknown,
    DefaultError,
    string
  >({
    endpoint: `/infinitalk/agentstatus/logincheck?domain=https://${sipAccount?.domain}`,
    config: {
      baseURL: DOMAINS.API_GATEWAY_DOMAIN,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    onSuccess: () => {
      const data = encodeFormData<LoginAgentFormValues>({
        ...sipInfo,
        webrtcflg: 1
      })
      loginAgent(data)
    }
  })

  const { mutate: loginAgent } = useMutation<unknown, DefaultError, string>({
    endpoint: `/infinitalk/agentstatus/login?domain=https://${sipAccount?.domain}`,
    config: {
      baseURL: DOMAINS.API_GATEWAY_DOMAIN,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    onSuccess: () =>
      changeStatus({
        Action: 'QueuePause',
        Queue: currentAgent?.groupNames?.[0],
        Interface: currentAgent?.interface,
        Paused: '0',
        Reason: '0'
      })
  })

  const buttons = segmentedButtonsCalculator(statusText)

  const handleStatusChange = (selectedValue: string) => {
    const paused = selectedValue === '0' ? '0' : '1'
    changeStatus({
      Action: 'QueuePause',
      Queue: currentAgent?.groupNames?.[0],
      Interface: currentAgent?.interface,
      Paused: paused,
      Reason: selectedValue
    })
  }

  const handleLoginAgent = () => {
    const data =
      encodeFormData<Omit<LoginAgentFormValues, 'webrtcflg'>>(sipInfo)
    checkAgentLogin(data)
  }

  const handleCall = () => {
    softPhone?.call('08032418093')
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Dialog dismissable={false} visible={isPending}>
        <Dialog.Content>
          <ActivityIndicator size="large" animating />
        </Dialog.Content>
      </Dialog>

      <Button mode="contained" onPress={handleCall}>
        Call
      </Button>

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
