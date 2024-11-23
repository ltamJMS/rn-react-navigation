import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack'
import React from 'react'
import Login from '../../screens/Login'

export type AuthStacksParamList = {
  Login: undefined
}

export type AuthStacksProps = NativeStackScreenProps<AuthStacksParamList>

const Stack = createNativeStackNavigator<AuthStacksParamList>()

export default function AuthStacks() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}
