// CallScreen.js
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../../shared/constants'
import Ionicons from 'react-native-vector-icons/Ionicons'

const phoneNumber = 111
const CallScreen = () => {
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
          <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
          <Text style={styles.callingText}>Calling...</Text>
        </View>

        <View style={styles.overlayUnder}>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.functionButton}>
                <Feather name="mic" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <Feather name="volume-2" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <Feather name="pause" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.functionButton}>
                <Feather name="mic" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <Ionicons name="keypad" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.functionButton}>
                <Feather name="corner-up-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleEndCall}
            style={styles.endCallButton}
          >
            <Text style={styles.endCallText}>End Call</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with 50% opacity
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10
  },

  callDetails: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
    width: '92%',
    backgroundColor: '#ff3b30',
    height: '30%'
  },
  phoneNumberText: {
    fontSize: 32,
    color: '#fff',
    marginRight: 10,
    marginBottom: 10
  },
  callingText: {
    fontSize: 18,
    color: '#aaa'
  },
  overlayUnder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  buttonsContainer: {
    width: '80%',
    backgroundColor: 'blue'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'green',
    marginBottom: 24
  },
  functionButton: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 1
  },
  endCallButton: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    marginBottom: 30,
    alignItems: 'center'
  },
  endCallText: {
    fontSize: 18,
    color: '#fff'
  }
})

export default CallScreen
