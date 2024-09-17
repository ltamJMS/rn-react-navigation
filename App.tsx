// import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { StatusBar, useColorScheme, LogBox } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import Toast from 'react-native-toast-message'
import messaging from '@react-native-firebase/messaging'
import Navigation from './navigation'

LogBox.ignoreAllLogs()

const App = () => {
  const scheme = useColorScheme()
  useEffect(() => {
    console.log('=====> APP RUNNING ...')
    StatusBar.setBarStyle('dark-content')

    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        console.warn('Permission status:', authStatus)
      }
    }

    requestUserPermission()
  }, [scheme])

  return (
    <>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
      <Toast position="top" bottomOffset={20} />
      {/* <View>
        <Text style={{ color: "red" }}>Hello World!</Text>
      </View> */}
    </>
  )
}

export default App
