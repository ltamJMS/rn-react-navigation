// OutgoingCall.tsx
import React, { useCallback, useRef, useState } from 'react'

import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet
} from 'react-native'
import { useRecoilState } from 'recoil'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  currentCallState,
  holdingCallState
} from '../../services/store/softphone'

interface OutgoingCallProps {
  handleCall: (number: string) => void
}
const OutgoingCall: React.FC<OutgoingCallProps> = ({ handleCall }) => {
  const phoneNumberRef = useRef<string>('')
  const [currentCall] = useRecoilState(currentCallState)
  const [holdingCall] = useRecoilState(holdingCallState)
  const [callAvailable, setCallAvailable] = useState(false)

  const handlePhoneNumberChange = useCallback((text: string) => {
    phoneNumberRef.current = text
    setCallAvailable(!!text)
  }, [])

  const handleCallPress = useCallback(() => {
    handleCall(phoneNumberRef.current)
  }, [handleCall])

  return (
    <View>
      <View
        style={[
          styles.actionContainer,
          { borderColor: 'gray', borderWidth: 0.8, marginTop: 20 }
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="電話番号 ..."
          placeholderTextColor="#30363b"
          defaultValue={'09019747098'} // Set initial value from ref
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={[
            styles.callButton,
            {
              backgroundColor: phoneNumberRef.current ? '#AACD06' : '#D9D9D9'
            }
          ]}
          disabled={!callAvailable}
          onPress={handleCallPress}
        >
          <Icon name="phone" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
      {currentCall && (
        <View style={styles.statusCallContainer}>
          <Text style={styles.textBasic}>{currentCall?.state}</Text>
          <Text style={styles.textBasic}>{currentCall?.dst.num}</Text>
        </View>
      )}
      {holdingCall && (
        <View style={styles.statusCallContainer}>
          <Text style={styles.textBasic}>保留中</Text>
          <Text style={styles.textBasic}>{holdingCall?.dst.num}</Text>
        </View>
      )}
    </View>
  )
}

export default OutgoingCall

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f6f8fa',
    fontSize: 16,
    borderColor: 'gray',
    padding: 10,
    paddingVertical: 10,
    width: 250
  },
  actionContainer: {
    backgroundColor: '#f6f8fa',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 20
  },
  callButton: {
    backgroundColor: '#AACD06',
    width: 44,
    height: 44,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 4
  },
  statusCallContainer: {
    backgroundColor: '#f6f8fa',
    marginVertical: 10
  },
  textBasic: {
    color: '#30363b'
  }
})
