import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from 'react-native'
import * as NavigationService from 'react-navigation-helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'
import { useRecoilState } from 'recoil'
import {
  callRequestState,
  currentCallState,
  holdingCallState,
  incomingRequestState
} from '../../services/store/softphone'
import { SCREENS } from '../../shared/constants'

const CallScreen = () => {
  const [micActive, setMicActive] = useState(false)
  const [speakerActive, setSpeakerActive] = useState(false)

  const {
    handleHold,
    handleUnHold,
    handleRefer,
    handleTerminate,
    handleAnswer
  } = useSoftPhone()
  const [callRequest] = useRecoilState(callRequestState)
  const [incomingRequest, setIncomingRequest] =
    useRecoilState(incomingRequestState)
  const { isOutbound } = callRequest
  const { isIncomingCall, incomingUserInfo } = incomingRequest
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [endCallTime, setEndCallTime] = useState<string>('')
  const [currentCall] = useRecoilState(currentCallState)
  const [holdingCall] = useRecoilState(holdingCallState)

  const isEnableTransfer = !!currentCall && !!holdingCall
  const isDisableEndCall = !currentCall && !holdingCall

  useEffect(() => {
    if (!currentCall && !holdingCall && !isIncomingCall && !isOutbound) {
      setTimeout(() => {
        NavigationService.goBack()
      }, 1000)
    }
  }, [currentCall, holdingCall, isIncomingCall, isOutbound])

  useEffect(() => {
    if (!currentCall || !currentCall.callConfirmTime) return

    const callStartTime = new Date(currentCall.callConfirmTime).getTime()
    const updateElapsedTime = () => {
      const now = Date.now()
      const diffInSeconds: number = Math.floor((now - callStartTime) / 1000)
      setElapsedTime(diffInSeconds)
    }

    updateElapsedTime()
    const timer = setInterval(updateElapsedTime, 1000)

    return () => clearInterval(timer)
  }, [currentCall])

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleHoldClick = () => {
    if (holdingCall) {
      handleUnHold(holdingCall.sessionId)
    } else {
      handleHold(currentCall?.sessionId)
    }
  }

  const handleTransfer = useCallback(async () => {
    if (!holdingCall || !currentCall) return

    try {
      await handleRefer(holdingCall.sessionId, currentCall.sessionId)
      setTimeout(() => {
        NavigationService.goBack()
      }, 3000)
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }, [holdingCall, currentCall, handleRefer])

  return (
    <ImageBackground
      source={require('../../assets/images/bgOverlay.png')}
      style={styles.backgroundImage}
    >
      {isIncomingCall ? (
        <View style={styles.overlay}>
          <View style={[styles.callDetails, styles.incomingDetails]}>
            <Text style={styles.nameText}>
              {incomingUserInfo?.displayName || 'Unknown'}
            </Text>
            <Text style={styles.callStatusText}>着信中</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <View
              style={[styles.buttonRow, { justifyContent: 'space-between' }]}
            >
              <View style={styles.button}>
                <TouchableOpacity
                  style={[
                    styles.functionButton,
                    { backgroundColor: '#ff3b30', borderWidth: 0 }
                  ]}
                  onPress={() => {
                    handleTerminate(currentCall?.sessionId)
                    setIncomingRequest((prev: typeof incomingRequest) => ({
                      ...prev,
                      isIncomingCall: false,
                      incomingUserInfo: {}
                    }))
                  }}
                >
                  <MaterialCommunityIcons
                    name="phone-hangup"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text style={[styles.buttonText, { color: '#606060' }]}>
                  拒否
                </Text>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  style={[
                    styles.functionButton,
                    { backgroundColor: '#8CC835', borderWidth: 0 }
                  ]}
                  onPress={() => {
                    handleAnswer(currentCall?.sessionId)
                    setIncomingRequest((prev: typeof incomingRequest) => ({
                      ...prev,
                      isIncomingCall: false,
                      incomingUserInfo: {}
                    }))
                  }}
                >
                  <MaterialCommunityIcons
                    name="phone-incoming"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text style={[styles.buttonText, { color: '#606060' }]}>
                  応答
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.overlay}>
          <View style={styles.callDetails}>
            {holdingCall && (
              <View style={styles.holdingCard}>
                <Text style={styles.holdingText}>
                  {holdingCall.dst?.displayName || holdingCall.dst.num}
                </Text>
                <Text style={styles.holdingText}>保留 - 1:24</Text>
              </View>
            )}
            {currentCall && (
              <View style={styles.callingCard}>
                <View style={styles.callingLeft}>
                  <Text style={styles.nameText}>
                    {currentCall
                      ? currentCall.dst?.displayName || currentCall.dst.num
                      : ''}
                  </Text>
                  <Text style={styles.phoneNumberText}>
                    {currentCall && currentCall.dst?.displayName
                      ? currentCall.dst.displayName
                      : ''}
                  </Text>
                </View>
                <View style={styles.callingRight}>
                  <Text style={styles.callStatusText}>
                    {currentCall ? currentCall.state : ''}
                  </Text>
                  <Text style={styles.phoneNumberText}>
                    {currentCall ? formatTime(elapsedTime) : ''}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.overlayUnder}>
            {!currentCall && !holdingCall && !isOutbound ? (
              <View style={styles.callingRight}>
                <Text style={[styles.endCallText]}>通話が終了しました</Text>
                <Text style={[styles.endCallText, { marginBottom: 10 }]}>
                  {endCallTime}
                </Text>
                <TouchableOpacity
                  style={styles.functionButton}
                  onPress={() => {
                    NavigationService.goBack()
                  }}
                >
                  <MaterialCommunityIcons
                    name="window-close"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <View style={styles.buttonRow}>
                  {/* mic - unmute */}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={[
                        styles.functionButton,
                        micActive ? styles.activeButton : {}
                      ]}
                      onPress={() => setMicActive(!micActive)}
                    >
                      <MaterialCommunityIcons
                        name={micActive ? 'microphone-off' : 'microphone'}
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>マイク</Text>
                  </View>

                  {/* speaker - speaker off */}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={[
                        styles.functionButton,
                        speakerActive ? styles.activeButton : {}
                      ]}
                      onPress={() => setSpeakerActive(!speakerActive)}
                    >
                      <Ionicons name="volume-medium" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>スピーカ</Text>
                  </View>

                  {/* hold - unhold */}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={[
                        styles.functionButton,
                        holdingCall ? styles.activeButton : {}
                      ]}
                      onPress={() => handleHoldClick()}
                    >
                      <MaterialCommunityIcons
                        name={
                          holdingCall
                            ? 'hand-back-right-off'
                            : 'hand-back-right'
                        }
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>
                      {holdingCall ? '解除' : '保留'}
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  {/* call record */}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={[
                        styles.functionButton,
                        { borderColor: '#606060' }
                      ]}
                      disabled={true}
                    >
                      <MaterialCommunityIcons
                        name="record-circle-outline"
                        size={22}
                        color="#606060"
                      />
                    </TouchableOpacity>
                    <Text style={[styles.buttonText, { color: '#606060' }]}>
                      レコード
                    </Text>
                  </View>
                  {/* Keypad */}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={[styles.functionButton, {}]}
                      onPress={() => NavigationService.navigate(SCREENS.KEYPAD)}
                    >
                      <Ionicons name="keypad" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>キーパッド</Text>
                  </View>
                  {/* transfer */}
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={[
                        styles.functionButton,
                        !isEnableTransfer ? styles.disableButton : {}
                      ]}
                      onPress={handleTransfer}
                      disabled={!isEnableTransfer}
                    >
                      <Fontisto
                        name="share-a"
                        size={16}
                        color={!isEnableTransfer ? '#606060' : '#fff'}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.buttonText,
                        !isEnableTransfer ? styles.disableText : {}
                      ]}
                    >
                      転送
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.endCallButton,
                isDisableEndCall ? { backgroundColor: '#606060' } : {}
              ]}
              onPress={() => {
                setEndCallTime(formatTime(elapsedTime))
                handleTerminate(currentCall?.sessionId)
              }}
              disabled={!currentCall && !holdingCall}
            >
              <MaterialCommunityIcons
                name="phone-hangup"
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10
  },
  callDetails: {
    marginBottom: 10,
    width: '96%',
    height: '30%'
  },
  incomingDetails: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  holdingCard: {
    padding: 14,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(142, 142, 142, 0.09)'
  },
  holdingText: {
    fontSize: 16,
    color: '#fff'
  },
  callingCard: {
    padding: 14,
    marginTop: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(142, 142, 142, 0.09)'
  },
  callingLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  callingRight: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8
  },
  phoneNumberText: {
    fontSize: 16,
    color: '#fff'
  },
  callStatusText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8
  },
  overlayUnder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  buttonsContainer: {
    width: '80%'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24
  },
  button: {
    alignItems: 'center',
    flexDirection: 'column'
  },
  functionButton: {
    width: 74,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: '#fff',
    borderWidth: 1
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  disableButton: {
    borderColor: '#606060'
  },
  disableText: {
    color: '#606060'
  },
  buttonText: {
    marginTop: 5,
    color: '#fff',
    textAlign: 'center'
  },
  endCallText: {
    color: '#fff',
    alignItems: 'center',
    fontSize: 20,
    marginVertical: 10
  },
  endCallButton: {
    width: '90%',
    paddingVertical: 12,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    marginBottom: '5%',
    alignItems: 'center'
  }
})

export default CallScreen
