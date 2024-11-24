import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { isReadyRef, navigationRef } from 'react-navigation-helpers'

// ? Screens
import LoginScreen from '../screens/Login'
import RenderTabNavigation from './RenderTabNavigation'
import Keypad from '../screens/Keypad'
import { SCREENS } from '../shared/constants'
import HomeScreen from '../screens/HomeScreen'
import CallScreen from '../screens/CallCenter/CallScreen'

const Stack = createStackNavigator()

const Navigation = () => {
  React.useEffect((): any => {
    return () => (isReadyRef.current = false)
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true
      }}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={SCREENS.LOGIN}
      >
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
        <Stack.Screen
          name={SCREENS.AGENT_MEMBER}
          component={RenderTabNavigation}
        />
        <Stack.Screen name={SCREENS.KEYPAD} component={Keypad} />
        <Stack.Screen name={SCREENS.CALL_SCREEN} component={CallScreen} />
        <Stack.Screen name={SCREENS.CALL_HISTORY} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
