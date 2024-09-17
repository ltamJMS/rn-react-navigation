import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack'
import React from 'react'
import Login from '../../screens/Login'
import Register from '../../screens/Register'
import Home from '../../screens/HomeScreen'

export type AuthStacksParamList = {
  Login: undefined
  Register: undefined
  Home: undefined
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
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  )
}
