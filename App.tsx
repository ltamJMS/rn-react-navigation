import LottieSplashScreen from '@attarchi/react-native-lottie-splash-screen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useShallow } from 'zustand/shallow'

import { useQuery } from './hooks/useQuery'
import AuthStacks from './navigators/auth_stacks'
import MainTabs from './navigators/main_tabs'
import RootProvider from './providers/root_provider'
import useBoundStore from './stores'
import { SipAccount } from './types'

const Stack = createNativeStackNavigator()

export default function App() {
  const { user, sipAccount, setSipAccount } = useBoundStore(
    useShallow((state) => ({
      user: state.user,
      sipAccount: state.sipAccount,
      setSipAccount: state.setSipAccount
    }))
  )

  useQuery<SipAccount>({
    queryKey: [
      `/v1/agents/users/${user?.username}/sip-account?customerId=${user?.agreementID}`
    ],
    enabled: !!user,
    onSuccess: (data: SipAccount) => {
      setSipAccount(data)
      LottieSplashScreen.hide()
    },
    onError: () => LottieSplashScreen.hide()
  })

  return (
    <RootProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {sipAccount ? (
          <Stack.Screen name='main' component={MainTabs} />
        ) : (
          <Stack.Screen name='auth' component={AuthStacks} />
        )}
      </Stack.Navigator>
    </RootProvider>
  )
}
