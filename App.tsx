import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { AppState, AppStateStatus, LogBox } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import Toast from 'react-native-toast-message'
import Navigation from './navigation'
import BootSplash from 'react-native-bootsplash'
import messaging from '@react-native-firebase/messaging'
import './services/store/logger.ts'

LogBox.ignoreAllLogs()

const App = () => {
  useEffect(() => {
    // Function to handle state change
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('🍀 APP STATE ...', nextAppState)
    }

    // Register event listener
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    )

    const a = async () => await BootSplash.hide({ fade: true })

    a()
    const requestUserPermission = async () => {
      await messaging().requestPermission()
    }

    requestUserPermission()
    // Cleanup listener on unmount
    return () => {
      subscription.remove()
    }
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
