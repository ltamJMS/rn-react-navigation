// Import React and necessary components from React Native
import React from 'react'
import { Text, View } from 'react-native'
import TestBtn from './AgentMember/TestBtn'
import { useSoftPhoneContext } from '../SoftPhoneProvider'
import { useRecoilState, useRecoilValue } from 'recoil'
import { sipAccountState } from '../services/store/auth'
import { SipConfig } from '../services/models/softPhone'
import { useSoftPhone } from '../services/usecases/auth/useSoftPhone'
import { currentCallState } from '../services/store/softphone'

// Define the TestScreen1 component
export default function TestScreen1() {
  const { softPhone, setupSoftPhone } = useSoftPhoneContext()
  const sipAccountData = useRecoilValue(sipAccountState)
  const { handleCall } = useSoftPhone()
  const [currentCall] = useRecoilState(currentCallState)

  const handleLoginTest = () => {
    const sipConfig: SipConfig = {
      account: sipAccountData.sipAccount,
      password: sipAccountData.sipPassword,
      domain: sipAccountData.domain,
      port: 8089
    }
    setupSoftPhone(sipConfig)
  }

  const handleCallTest = (phoneNumber: string) => {
    console.log('Calling:', phoneNumber)
    if (!softPhone) {
      console.log('SoftPhone not initialized')
      return
    }
    handleCall(phoneNumber)
  }
  return (
    <View>
      <TestBtn handleClick={() => handleLoginTest()} btnName="login" />

      <TestBtn
        handleClick={() => handleCallTest('09019747098')}
        btnName="call"
      />
      {currentCall && (
        <View>
          <Text>Current Call: {currentCall.dst.num}</Text>
        </View>
      )}
    </View>
  )
}
