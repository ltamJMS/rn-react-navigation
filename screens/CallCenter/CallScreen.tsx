import React, { useState } from 'react'
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
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const CallScreen = () => {
  const [micActive, setMicActive] = useState(false)
  const [speakerActive, setSpeakerActive] = useState(false)
  const [holdActive, setHoldActive] = useState(false)
  const [keypadActive, setKeypadActive] = useState(false)
  const [transferActive, setTransferActive] = useState(false)

  const handleEndCall = () => {
    NavigationService.goBack()
  }

  return (
    <ImageBackground
      source={require('../../assets/images/bgOverlay.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.callDetails}>
          <View style={styles.holdingCard}>
            <Text style={styles.holdingText}>Customer A</Text>
            <Text style={styles.holdingText}>保留 - 1:24</Text>
          </View>
          <View style={styles.callingCard}>
            <View style={styles.callingLeft}>
              <Text style={styles.nameText}>202_OPa002</Text>
              <Text style={styles.phoneNumberText}>202</Text>
            </View>
            <View style={styles.callingRight}>
              <Text style={styles.callStatusText}>通話中</Text>
              <Text style={styles.callTimeText}>0:07</Text>
            </View>
          </View>
        </View>

        <View style={styles.overlayUnder}>
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
                    size={26}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text style={styles.buttonText}>
                  {micActive ? 'Unmute' : 'Mic'}
                </Text>
              </View>

              <View style={styles.button}>
                <TouchableOpacity
                  style={[
                    styles.functionButton,
                    speakerActive ? styles.activeButton : {}
                  ]}
                  onPress={() => setSpeakerActive(!speakerActive)}
                >
                  <Ionicons name="volume-medium" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Speaker</Text>
              </View>

              <View style={styles.button}>
                <TouchableOpacity
                  style={[
                    styles.functionButton,
                    holdActive ? styles.activeButton : {}
                  ]}
                  onPress={() => setHoldActive(!holdActive)}
                >
                  <MaterialCommunityIcons
                    name={
                      holdActive ? 'hand-back-right-off' : 'hand-back-right'
                    }
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text style={styles.buttonText}>
                  {holdActive ? 'Unhold' : 'Hold'}
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <View style={styles.button}>
                <TouchableOpacity
                  style={[styles.functionButton, { borderColor: '#606060' }]}
                  disabled={true}
                >
                  <MaterialCommunityIcons
                    name="record-circle-outline"
                    size={24}
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
                  onPress={() => setKeypadActive(!keypadActive)}
                >
                  <Ionicons name="keypad" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Keypad</Text>
              </View>

              <View style={styles.button}>
                <TouchableOpacity
                  style={[
                    styles.functionButton,
                    transferActive ? styles.activeButton : {}
                  ]}
                  onPress={() => setTransferActive(!transferActive)}
                >
                  <Fontisto name="share-a" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Transfer</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleEndCall}
            style={styles.endCallButton}
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
    marginTop: 20,
    width: '96%',
    height: '30%'
  },
  holdingCard: {
    padding: 20,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(142, 142, 142, 0.09)'
  },
  holdingText: {
    fontSize: 18,
    color: '#fff'
  },
  callingCard: {
    padding: 20,
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(142, 142, 142, 0.09)'
  },
  callingLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  callingRight: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 28,
    color: '#fff',
    marginRight: 10,
    marginBottom: 10
  },
  phoneNumberText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
    marginBottom: 10
  },
  callStatusText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
    marginBottom: 10
  },
  callTimeText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
    marginBottom: 10
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
    width: 90,
    height: 90,
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
  endCallButton: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    marginBottom: 30,
    alignItems: 'center'
  }
})

export default CallScreen
