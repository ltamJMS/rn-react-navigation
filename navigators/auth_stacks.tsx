import Login from 'screens/Login'
import { AuthStacksParamList } from 'types/navigators'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator<AuthStacksParamList>()

export default function AuthStacks() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='Login' component={Login} />
    </Stack.Navigator>
  )
}
