import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { isReadyRef, navigationRef } from 'react-navigation-helpers'

// ? Screens
import LoginScreen from '../screens/Login'
import RenderTabNavigation from './RenderTabNavigation'
import CallHistory from '../screens/CallHistory'
import { SCREENS } from '../shared/constants'
import AgentMemberScreen from '../screens/AgentMember/AgentMemberScreen'

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
        <Stack.Screen name={SCREENS.HOME} component={RenderTabNavigation} />
        <Stack.Screen name={SCREENS.CALL_HISTORY} component={CallHistory} />
        <Stack.Screen
          name={SCREENS.AGENT_MEMBER}
          component={AgentMemberScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
