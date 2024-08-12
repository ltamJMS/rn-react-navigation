import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack'
import React from 'react'
import Login from '../../screens/Login'
import Register from '../../screens/Register'

export type AuthStacksParamList = {
  Login: undefined
  Register: undefined
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
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}
