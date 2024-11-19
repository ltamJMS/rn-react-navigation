import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
// import Text from '../shared/components/text-wrapper/TextWrapper'
import JsSIP from 'jssip'
import { useRecoilState, useRecoilValue } from 'recoil'
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
import { uploadLogFile } from '../services/store/logger'
import { authState } from '../services/store/auth'

JsSIP.debug.enable('JsSIP:*')

export default function HomeScreen() {
  const [isShowIncoming, setIsShowIncoming] = useRecoilState(incomingShowState)
  const {
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
  const auth = useRecoilValue(authState)

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss()
            }}
            accessible={false}
          >
            <View style={styles.screenView}>
              <View>
                <View>
                  {isShowIncoming && (
                    <IncomingCallDialog
                      visible={isShowIncoming}
                      onAnswer={() => handleAnswer(currentCall?.sessionId)}
                      onDecline={() => handleTerminate(currentCall?.sessionId)}
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
                        <Icon name="phone-forward" size={22} color="#ffffff" />
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
                        onPress={() => handleTerminate(currentCall?.sessionId)}
                      >
                        <Icon name="phone-hangup" size={22} color="#ffffff" />
                      </TouchableOpacity>
                      <Text style={styles.buttonText}>切断</Text>
                    </View>
                  </View>
                )}
              </View>
              <View>
                <Button
                  icon="arrow-up"
                  mode="contained"
                  style={{ backgroundColor: '#333942', marginBottom: 20 }}
                  onPress={() => uploadLogFile(auth?.customerID || '099a1')}
                >
                  UPLOAD LOG FILE
                </Button>
                <Button
                  icon="power-standby"
                  mode="contained"
                  style={{ backgroundColor: '#333942', marginBottom: 20 }}
                  onPress={() => handleLogout()}
                >
                  Logout
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
