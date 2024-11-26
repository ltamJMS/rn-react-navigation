import React, { useEffect, useState } from 'react'
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
  holdingCallState
} from '../../services/store/softphone'
import { agentsState } from '../../services/store/agentStatus'
import AgentStatus from '../../services/models/softPhone'
import TransferModal from './TransferModal'
import { SCREENS } from '../../shared/constants'

const CallScreen = () => {
  const [agents] = useRecoilState(agentsState)
  const [micActive, setMicActive] = useState(false)
  const [speakerActive, setSpeakerActive] = useState(false)
  const [keypadActive, setKeypadActive] = useState(false)
  const [transferModalVisible, setTransferModalVisible] = useState(false)
  //
  const { handleHold, handleUnHold, handleCall, handleRefer, handleTerminate } =
    useSoftPhone()
  const [callRequest, setCallRequest] = useRecoilState(callRequestState)
  const { isOutbound, phoneNumber } = callRequest
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [endCallTime, setEndCallTime] = useState<string>('')
  const [currentCall] = useRecoilState(currentCallState)
  const [holdingCall] = useRecoilState(holdingCallState)
  const agentArray = Object.values(agents)

  useEffect(() => {
    if (isOutbound && phoneNumber) {
      handleCall(phoneNumber).then(() => {
        setCallRequest({
          phoneNumber: '',
          isOutbound: false
        })
      })
    }
  }, [callRequest, handleCall, isOutbound, phoneNumber, setCallRequest])

  useEffect(() => {
    if (!currentCall && !holdingCall && !isOutbound) {
      setTimeout(() => {
        NavigationService.goBack()
      }, 2000)
    }
  }, [currentCall, holdingCall, isOutbound])

  useEffect(() => {
    console.log('======================= currentCall', currentCall)
  }, [currentCall])

  useEffect(() => {
    console.log('======================= holdingCall', holdingCall)
  }, [holdingCall])

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

  const handleTransfer = (extenNumber: string) => {
    if (!holdingCall || !currentCall || !extenNumber) return
    handleRefer(holdingCall?.sessionId, currentCall?.sessionId)
    setTransferModalVisible(false)
  }
  return (
    <ImageBackground
      source={require('../../assets/images/bgOverlay.png')}
      style={styles.backgroundImage}
    >
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
          {(currentCall || isOutbound) && (
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
              <Text style={[styles.endCallText]}>{endCallTime}</Text>
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonRow}>
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
                  <Text style={styles.buttonText}>
                    {micActive ? 'Unmute' : 'Mic'}
                  </Text>
                </View>

                {/* hold - unhold */}
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
                  <Text style={styles.buttonText}>Speaker</Text>
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
                        holdingCall ? 'hand-back-right-off' : 'hand-back-right'
                      }
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <Text style={styles.buttonText}>
                    {holdingCall ? 'Unhold' : 'Hold'}
                  </Text>
                </View>
              </View>

              {/* call record */}
              <View style={styles.buttonRow}>
                <View style={styles.button}>
                  <TouchableOpacity
                    style={[styles.functionButton, { borderColor: '#606060' }]}
                    disabled={true}
                  >
                    <MaterialCommunityIcons
                      name="record-circle-outline"
                      size={22}
                      color="#606060"
                    />
                  </TouchableOpacity>
                  <Text style={[styles.buttonText, { color: '#606060' }]}>
                    Record
                  </Text>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity
                    style={[
                      styles.functionButton,
                      keypadActive ? styles.activeButton : {}
                    ]}
                    onPress={() => NavigationService.navigate(SCREENS.KEYPAD)}
                  >
                    <Ionicons name="keypad" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.buttonText}>Keypad</Text>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity
                    style={[
                      styles.functionButton,
                      transferModalVisible ? styles.activeButton : {}
                    ]}
                    onPress={() => setTransferModalVisible(true)}
                    disabled={!holdingCall}
                  >
                    <Fontisto name="share-a" size={16} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.buttonText}>Transfer</Text>
                </View>
              </View>
              <TransferModal
                visible={transferModalVisible}
                onClose={() => setTransferModalVisible(false)}
                agents={agentArray}
                onTransfer={extenNumber => {
                  console.log(`Transferring to ${extenNumber}`)
                  handleTransfer(extenNumber)
                }}
                onCall={extenNumber => {
                  console.log(`Calling ${extenNumber}`)
                  setCallRequest({
                    phoneNumber: extenNumber,
                    isOutbound: true
                  })
                  setTransferModalVisible(false)
                }}
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.endCallButton,
              currentCall ? {} : { backgroundColor: '#606060' }
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
