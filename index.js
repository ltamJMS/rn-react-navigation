import { AppRegistry, Platform } from 'react-native'
import HeadlessCheck from './RecoilRoot'
import { name as appName } from './app.json'
import firebase from '@react-native-firebase/app'
import RNCallKeep from 'react-native-callkeep'
import VoipPushNotification from 'react-native-voip-push-notification'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS, firebaseProConfig } from './shared/constants'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseProConfig)
}

const handleIncomingCall = async () => {
  console.log('🍀🍀🍀🍀🍀🍀 Click accept')
  NavigationService.navigate(SCREENS.HOME)
  setTimeout(() => {
    RNCallKeep.endAllCalls()
  }, 6000)
}

// Function to handle call decline
const handleDecline = () => {
  console.log('🍀🍀🍀🍀🍀🍀Call declined')
  RNCallKeep.endAllCalls()
}

const options = {
  ios: {
    appName: 'InfinitalkPhone',
    imageName: 'AppIcon'
  }
}

RNCallKeep.setup(options).then(accepted => {
  console.log('🍀🍀🍀🍀🍀 CallKeep setup completed:', accepted)
})

RNCallKeep.addEventListener('answerCall', async () => handleIncomingCall())
RNCallKeep.addEventListener('endCall', async () => handleDecline())

if (Platform.OS === 'ios') {
  VoipPushNotification.addEventListener('notification', notification => {
    console.log('🍀🍀🍀🍀🍀VoIP push notification received:', notification)
    NavigationService.navigate(SCREENS.HOME)
  })

  VoipPushNotification.addEventListener('didLoadWithEvents', events => {
    if (events && Array.isArray(events) && events.length > 0) {
      events.forEach(voipPushEvent => {
        const { name, data } = voipPushEvent
        console.log('🍀🍀🍀🍀🍀VoIP voipPushEvent', name, data)
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          console.log('🍀🍀🍀🍀🍀VoIP push event received:', data)
        }
      })
    }
  })
}

AppRegistry.registerComponent(appName, () => HeadlessCheck)
