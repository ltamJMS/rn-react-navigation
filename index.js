import { AppRegistry, AppState } from 'react-native'
import RecoilApp from './RecoilRoot'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory
} from '@notifee/react-native'
import firebase from '@react-native-firebase/app'

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

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🍀 BACKGROUND NOTIFICATION', remoteMessage)

  if (remoteMessage && remoteMessage.data) {
    const { customerPhoneNumber } = remoteMessage.data
    const channelId = await notifee.createChannel({
      id: 'softphone-channel',
      name: 'Softphone Channel',
      sound: 'phoneringtone',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      badge: true,
      vibration: true,
      vibrationPattern: [300, 500]
    })

    await notifee.displayNotification({
      title: 'Incoming call',
      body: customerPhoneNumber,
      android: {
        channelId,
        sound: 'phoneringtone',
        color: '#AACD06',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        category: AndroidCategory.CALL,
        vibrationPattern: [300, 500],
        pressAction: {
          id: 'default'
        }
      },
      ios: {
        interruptionLevel: 'critical',
        lockScreen: 1,
        notificationCenter: 1,
        sound: 'phoneringtone.wav'
      }
    })
  }
})

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('🍀 BACKGROUND EVENT', type, detail)
})

AppRegistry.registerComponent(appName, () => RecoilApp)
