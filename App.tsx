import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import Toast from 'react-native-toast-message'
import Navigation from './navigation'
import BootSplash from 'react-native-bootsplash'
import messaging from '@react-native-firebase/messaging'

LogBox.ignoreAllLogs()

const App = () => {
  useEffect(() => {
    console.log('🍀 APP RUNNING ... ')

    const a = async () => await BootSplash.hide({ fade: true })

    a()
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        console.warn('🍀 Permission status:', authStatus)
      }
    }

    requestUserPermission()
  }, [])

  return (
    <>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
      <Toast position="top" bottomOffset={20} />
      {/* <View>
        <Text style={{ color: 'red' }}>Hello World!</Text>
      </View> */}
    </>
  )
}

export default App
