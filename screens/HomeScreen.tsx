// Import React and necessary components from React Native
import React from 'react'
import { Text, View } from 'react-native'
import TestBtn from './AgentMember/TestBtn'
import { useRecoilState } from 'recoil'
import { useSoftPhone } from '../services/usecases/auth/useSoftPhone'
import { currentCallState } from '../services/store/softphone'

// Define the TestScreen1 component
export default function TestScreen1() {
  const { handleCall, handleTerminate } = useSoftPhone()
  const [currentCall] = useRecoilState(currentCallState)

  const handleCallTest = (phoneNumber: string) => {
    console.log('Calling:', phoneNumber)
    handleCall(phoneNumber)
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Call History</Text>
      {currentCall && (
        <View>
          <Text>Current Call: {currentCall.dst.num}</Text>
        </View>
      )}
    </View>
  )
}
