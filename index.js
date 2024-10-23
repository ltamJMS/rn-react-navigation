import { AppRegistry } from 'react-native'
import RecoilApp from './RecoilRoot'
import { name as appName } from './app.json'
import messaging from '@react-native-firebase/messaging'
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory
} from '@notifee/react-native'

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🍀 FCM BACKGROUND', remoteMessage)

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
  console.warn('🍀 NOTIFEE BACKGROUND', type, detail)
})

AppRegistry.registerComponent(appName, () => RecoilApp)
