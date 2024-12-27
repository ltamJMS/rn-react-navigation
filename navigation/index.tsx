import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { isReadyRef, navigationRef } from 'react-navigation-helpers'

// ? Screens
import LoginScreen from '../screens/Login'
import RenderTabNavigation from './RenderTabNavigation'
import Keypad from '../screens/Keypad'
import { SCREENS } from '../shared/constants'
import CallHistory from '../screens/CallHistory'
import CallScreen from '../screens/CallCenter/CallScreen'
import CallHistoryDetail from '../screens/layout/CallHistoryDetail'

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
        <Stack.Screen name={SCREENS.CALL_HISTORY} component={CallHistory} />
        <Stack.Screen
          name={SCREENS.CALL_HISTORY_DETAIL}
          component={CallHistoryDetail}
          options={{
            headerShown: true,
            headerBackTitle: '戻る'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
