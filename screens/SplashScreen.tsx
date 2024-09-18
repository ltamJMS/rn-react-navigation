import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

export default function SplashScreen() {
  useEffect(() => {
    console.log('=====> APP RUNNING ... splash screen')

    // const requestUserPermission = async () => {
    //   console.log('=====> APP RUNNING ... splash screen')
    // }

    // requestUserPermission()
  }, [])
  return (
    <View>
      <Text>SplashScreen</Text>
    </View>
  )
}
