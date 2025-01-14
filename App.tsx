import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { AppState, AppStateStatus, LogBox } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import Toast from 'react-native-toast-message'
import Navigation from './navigation'
import BootSplash from 'react-native-bootsplash'
import messaging from '@react-native-firebase/messaging'
// import './services/store/logger.ts'
import { SoftPhoneProvider } from './SoftPhoneProvider.tsx'
import AsyncStorage from '@react-native-async-storage/async-storage'
import JmsCodeDialog from './shared/components/JmsCodeDialog.tsx'

LogBox.ignoreAllLogs()

const App = () => {
  const [dialogVisible, setDialogVisible] = useState(false)

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const code = await AsyncStorage.getItem('@jms_code')
      if (!code) {
        setDialogVisible(true)
      }
    }

    checkFirstLaunch()

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

  const handleCodeSubmit = async (code: string) => {
    await AsyncStorage.setItem('@jms_code', code)
    setDialogVisible(false)
  }

  return (
    <SoftPhoneProvider>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
      <Toast position="top" bottomOffset={20} />
      <JmsCodeDialog
        visible={dialogVisible}
        onCancel={() => setDialogVisible(false)}
        onSubmit={handleCodeSubmit}
      />
    </SoftPhoneProvider>
  )
}

export default App
