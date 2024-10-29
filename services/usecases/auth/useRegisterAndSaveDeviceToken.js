import { useCallback } from 'react'
import messaging from '@react-native-firebase/messaging'
import firestore from '@react-native-firebase/firestore'
import { Platform } from 'react-native'

const useRegisterAndSaveDeviceToken = () => {
  const registerAndSaveToken = useCallback(async sipAccount => {
    try {
      // Get the token
      const token = await messaging().getToken()
      console.log('Device Token:', token)

      // Save token to Firestore
      await firestore().collection('deviceTokens').add({
        sipAccount: sipAccount,
        token: token,
        platform: Platform.OS,
        timestamp: firestore.FieldValue.serverTimestamp()
      })

      console.log('Device token saved successfully!')
    } catch (error) {
      console.error('Error saving device token to Firestore:', error)
    }
  }, [])

  return registerAndSaveToken
}

export default useRegisterAndSaveDeviceToken
