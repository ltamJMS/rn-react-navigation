import { AppRegistry, Platform } from 'react-native'
import HeadlessCheck from './RecoilRoot'
import { name as appName } from './app.json'
import firebase from '@react-native-firebase/app'
import RNCallKeep from 'react-native-callkeep'
import VoipPushNotification from 'react-native-voip-push-notification'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from './shared/constants'

if (!firebase.apps.length) {
  // const firebaseDevConfig = {
  //   apiKey: 'AIzaSyAyy5XNS9_-QRhKGSJQE5GbKnXULhEtDKU',
  //   authDomain: 'infinitalk-dev.firebaseapp.com',
  //   databaseURL: 'https://infinitalk-dev-default-rtdb.firebaseio.com',
  //   projectId: 'infinitalk-dev',
  //   storageBucket: 'infinitalk-dev.appspot.com',
  //   messagingSenderId: '555354526963',
  //   appId: '1:555354526963:android:1c4870ff33de17ddc89386'
  // }
  const firebaseProConfig = {
    apiKey: 'AIzaSyBg3MMVPmKU1cvcP_3vcklTnHb6LWhPDoY',
    authDomain: 'commercial-001.firebaseapp.com',
    databaseURL: 'https://commercial-001.firebaseio.com',
    projectId: 'commercial-001',
    storageBucket: 'commercial-001.appspot.com',
    messagingSenderId: '552887512270',
    appId: '1:552887512270:android:27945947756f5f0791b49f'
  }
  firebase.initializeApp(firebaseProConfig)
}

const handleIncomingCall = async () => {
  console.log('🍀 🍀 🍀 🍀 🍀 🍀 Incoming call')
  NavigationService.navigate(SCREENS.HOME)
  setTimeout(() => {
    RNCallKeep.endAllCalls()
  }, 5000)
}

// Function to handle call decline
const handleDecline = () => {
  console.log('🍀 🍀 🍀 🍀 🍀 🍀 Call declined')
}

const options = {
  ios: {
    appName: 'InfinitalkPhone'
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
    imageName: 'phone_account_icon',
    foregroundService: {
      channelId: 'com.rn.voipdemo',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running in the background',
      notificationIcon: 'Path to the resource icon of the notification'
    }
  }
}

RNCallKeep.setup(options).then(accepted => {
  console.log('🍀 🍀 🍀 🍀 🍀 CallKeep setup completed:', accepted)
})

RNCallKeep.addEventListener('answerCall', async () => handleIncomingCall())
RNCallKeep.addEventListener('endCall', async () => handleDecline())

if (Platform.OS === 'ios') {
  VoipPushNotification.addEventListener('notification', notification => {
    console.log('🍀 🍀 🍀 🍀 🍀 VoIP push notification received:', notification)
    NavigationService.navigate(SCREENS.HOME)
  })

  VoipPushNotification.addEventListener('didLoadWithEvents', events => {
    if (events && Array.isArray(events) && events.length > 0) {
      events.forEach(voipPushEvent => {
        const { name, data } = voipPushEvent
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          console.log('🍀 🍀 🍀 🍀 🍀 VoIP push event received:', data)
        }
      })
    }
  })
}

AppRegistry.registerComponent(appName, () => HeadlessCheck)
