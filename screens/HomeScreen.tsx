import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Text from '../shared/components/text-wrapper/TextWrapper'
import JsSIP from 'jssip'
import { useRecoilState } from 'recoil'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  agentLoginState,
  currentCallState,
  holdingCallState,
  incomingShowState
} from '../services/store/softphone'
import { useSoftPhone } from '../services/usecases/auth/useSoftPhone'
import IncomingCallDialog from './layout/IncomingCallDialog'
import OutgoingCall from './layout/OutgoingCall'
import { Button } from 'react-native-paper'
JsSIP.debug.enable('JsSIP:*')

export default function HomeScreen() {
  const [loading, setLoading] = useState(false)
  const [isShowIncoming, setIsShowIncoming] = useRecoilState(incomingShowState)
  const {
    handleLogin,
    handleCall,
    handleAnswer,
    handleHold,
    handleUnHold,
    handleRefer,
    handleTerminate,
    handleLogout
  } = useSoftPhone()
  const [currentCall] = useRecoilState(currentCallState)
  const [holdingCall] = useRecoilState(holdingCallState)
  const [agentLoginStatus] = useRecoilState(agentLoginState)
  const handleDecline = () => {
    console.log('Decline the call')
    setIsShowIncoming(false)
  }
  useEffect(() => {
    console.log('=====> agentLoginStatus', agentLoginStatus)
  }, [agentLoginStatus])
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          {loading ? (
            <View>
              <View style={{ marginBottom: 30 }}>
                <ActivityIndicator size="large" color="#AACD06" />
              </View>
            </View>
          ) : (
            <View style={styles.screenView}>
              {/* 1. Agent Login */}
              <View>
                <View style={styles.spaceButton}>
                  {agentLoginStatus ? (
                    <Button
                      mode="contained"
                      icon="headphones"
                      style={{ backgroundColor: '#3498db' }}
                      onPress={async () => {
                        handleLogin(setLoading)
                      }}
                    >
                      待機中
                    </Button>
                  ) : (
                    <Button
                      mode="contained"
                      style={{ backgroundColor: '#757575' }}
                      onPress={async () => {
                        handleLogin(setLoading)
                      }}
                    >
                      Agent Login
                    </Button>
                  )}
                </View>
                <View>
                  <View>
                    {isShowIncoming && (
                      <IncomingCallDialog
                        visible={isShowIncoming}
                        onAnswer={() => handleAnswer(currentCall?.sessionId)}
                        onDecline={handleDecline}
                        phoneNumber={currentCall?.src.num || 'anonymous'}
                        onRequestClose={() => setIsShowIncoming(false)}
                      />
                    )}
                    <OutgoingCall handleCall={handleCall} />
                  </View>
                  {(currentCall || holdingCall) && (
                    <View style={styles.actionContainer}>
                      {/* hold and unHold */}
                      {!holdingCall ? (
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleHold(currentCall?.sessionId)}
                          >
                            <Icon
                              name="hand-back-right"
                              size={22}
                              color="#ffffff"
                            />
                          </TouchableOpacity>
                          <Text style={styles.buttonText}>保留</Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[
                              styles.actionButton,
                              { backgroundColor: '#FF7628' }
                            ]}
                            onPress={() => handleUnHold(holdingCall?.sessionId)}
                          >
                            <Icon
                              name="hand-back-right-off"
                              size={22}
                              color="#ffffff"
                            />
                          </TouchableOpacity>
                          <Text style={styles.buttonText}>解除</Text>
                        </View>
                      )}
                      {/* refer */}
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() =>
                            handleRefer(
                              holdingCall?.sessionId,
                              currentCall?.sessionId
                            )
                          }
                        >
                          <Icon
                            name="phone-forward"
                            size={22}
                            color="#ffffff"
                          />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>転送</Text>
                      </View>
                      {/* end call */}
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: '#D92E27' }
                          ]}
                          onPress={() =>
                            handleTerminate(currentCall?.sessionId)
                          }
                        >
                          <Icon name="phone-hangup" size={22} color="#ffffff" />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>切断</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <Button
                icon="power-standby"
                mode="contained"
                style={{ backgroundColor: '#333942' }}
                onPress={() => handleLogout()}
              >
                Logout
              </Button>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    flex: 1
  },
  buttonText: {
    marginBottom: 4,
    color: '#30363b'
  },
  screenView: {
    backgroundColor: '#f6f8fa',
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center'
  },
  spaceButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300
  },
  actionContainer: {
    backgroundColor: '#f6f8fa',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 20
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 5
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10
  }
})
