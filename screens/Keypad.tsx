import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { IconButton, MD3Colors } from 'react-native-paper'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../shared/constants'
import { useRecoilState } from 'recoil'
import {
  agentLoginState,
  callRequestState,
  currentCallState,
  holdingCallState
} from '../services/store/softphone'
import { Button } from 'react-native-paper'
import { useSoftPhone } from '../services/usecases/auth/useSoftPhone'
var Sound = require('react-native-sound')

Sound.setCategory('Playback')

const Keypad = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [currentCall] = useRecoilState(currentCallState)
  const [holdingCall] = useRecoilState(holdingCallState)
  const [agentLoginStatus] = useRecoilState(agentLoginState)
  const [, setCallRequest] = useRecoilState(callRequestState)
  const { handleCall } = useSoftPhone()
  const { handleSendDTMF } = useSoftPhone()

  const [audio, setAudio] = useState<typeof Sound | null>(null)

  useEffect(() => {
    const sound = new Sound(
      'dialing-tone-1.mp3',
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log('failed to load the sound', error)
          return
        }
      }
    )
    sound.setVolume(1)
    setAudio(sound)

    return () => {
      sound.release()
    }
  }, [])

  const playTone = () => {
    if (!audio) return

    if (audio.isPlaying()) {
      audio.pause()
    } else {
      audio.play((success: boolean) => {
        if (success) {
          console.log('successfully finished playing')
        } else {
          console.log('playback failed due to audio decoding errors')
        }
      })
    }
  }

  const isCallButtonDisabled =
    !phoneNumber || !agentLoginStatus || !!currentCall

  const handlePress = useCallback(
    (value: string) => {
      if (!currentCall) {
        setPhoneNumber(prev => prev + value)
        playTone()
      } else if (currentCall && !holdingCall) {
        handleSendDTMF({ tone: value, sessionId: currentCall?.sessionId })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCall, holdingCall, setPhoneNumber, handleSendDTMF]
  )

  const handleCallClick = () => {
    if (phoneNumber) {
      setCallRequest({ phoneNumber, isOutbound: true })
      handleCall(phoneNumber)
      NavigationService.push(SCREENS.CALL_SCREEN)
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.phoneNumberContainer,
          { height: 50, paddingTop: 10, marginTop: 10 }
        ]}
      >
        {(currentCall || holdingCall) && (
          <Button
            mode="contained"
            style={{
              backgroundColor: '#8CC835',
              width: '38%',
              height: 38
            }}
            onPress={() => NavigationService.navigate(SCREENS.CALL_SCREEN)}
          >
            通話に戻る
          </Button>
        )}
        {(currentCall || holdingCall) && (
          <Ionicons name="caret-forward-outline" size={20} color="#8CC835" />
        )}
      </View>
      <View style={[styles.phoneNumberContainer, { alignItems: 'flex-start' }]}>
        <Text style={styles.phoneNumberText} numberOfLines={1}>
          {phoneNumber}
        </Text>
        {phoneNumber.length > 0 && (
          <View>
            <IconButton
              icon="backspace"
              iconColor={MD3Colors.neutralVariant70}
              size={22}
              onPress={() => setPhoneNumber(prev => prev.slice(0, -1))}
              onLongPress={() => setPhoneNumber('')}
            />
          </View>
        )}
      </View>
      <View style={styles.keypad}>
        {createKeypadRow(['1', '2', '3'], ['', 'ABC', 'DEF'], handlePress)}
        <Divider />
        {createKeypadRow(['4', '5', '6'], ['GHI', 'JKL', 'MNO'], handlePress)}
        <Divider />
        {createKeypadRow(['7', '8', '9'], ['PQRS', 'TUV', 'WXYZ'], handlePress)}
        <Divider />
        <View style={styles.keypadRow}>
          <TouchableOpacity
            onPress={() => handlePress('*')}
            style={styles.keypadButton}
          >
            <Fontisto name="asterisk" size={13} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('0')}
            onLongPress={() => handlePress('+')}
            style={styles.keypadButton}
          >
            <Text style={styles.buttonText}>0</Text>
            <Text style={styles.lettersText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('#')}
            style={styles.keypadButton}
          >
            <Fontisto name="hashtag" size={13} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleCallClick()}
        style={[
          styles.callButton,
          { backgroundColor: isCallButtonDisabled ? '#ccc' : '#8CC835' }
        ]}
        disabled={isCallButtonDisabled}
      >
        <FontAwesome name="phone" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const createKeypadRow = (
  keys: string[],
  letters: string[],
  onPress: (val: string) => void
) => (
  <View style={styles.keypadRow}>
    {keys.map((key, index) => (
      <TouchableOpacity
        key={key}
        onPress={() => onPress(key)}
        style={styles.keypadButton}
      >
        <Text style={styles.buttonText}>{key}</Text>
        <Text style={styles.lettersText}>{letters[index]}</Text>
      </TouchableOpacity>
    ))}
  </View>
)

const Divider = () => <View style={styles.divider} />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff'
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '92%',
    height: 80
  },
  phoneNumberText: {
    fontSize: 28,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10,
    textAlign: 'center',
    margin: 8
  },
  keypad: {
    width: '90%'
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  keypadButton: {
    width: '33%',
    padding: 14,
    alignItems: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 28
  },
  lettersText: {
    fontSize: 12,
    color: '#6b6b6b'
  },
  divider: {
    height: 0.5,
    backgroundColor: '#bbb',
    marginVertical: 1
  },
  callButton: {
    width: '90%',
    paddingVertical: 12,
    backgroundColor: '#8CC835',
    borderRadius: 5,
    marginVertical: '5%',
    alignItems: 'center'
  }
})

export default Keypad
