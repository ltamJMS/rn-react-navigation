import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { LogBox, Text, View } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import Toast from 'react-native-toast-message'
import Navigation from './navigation'

LogBox.ignoreAllLogs()

const App = () => {
  useEffect(() => {
    console.log('=====> APP RUNNING ... app')

    // const requestUserPermission = async () => {
    //   console.log('=====> APP RUNNING ... app 2')

    //   const authStatus = await messaging().requestPermission()
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL

    //   if (enabled) {
    //     console.warn('Permission status:', authStatus)
    //   }
    // }

    // requestUserPermission()
  }, [])

  return (
    <>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
      <Toast position="top" bottomOffset={20} />
      <View>
        <Text style={{ color: 'red' }}>Hello World!</Text>
      </View>
    </>
  )
}

export default App
