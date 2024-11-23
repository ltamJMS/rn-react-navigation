import React, { useEffect } from 'react'
import { StatusBar, useColorScheme } from 'react-native'

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import merge from 'deepmerge'
import BootSplash from 'react-native-bootsplash'
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider
} from 'react-native-paper'
import { useQuery } from './hooks/useQuery'
import AuthStacks from './navigators/stacks/AuthStacks'
import MainTabs from './navigators/tabs/MainTabs'
import useBoundStore from './stores'
import auth from '@react-native-firebase/auth'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NetworkLogger from 'react-native-network-logger'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SipAccount } from './types'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme
})

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme)

const Stack = createNativeStackNavigator()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <NetworkLogger />
    </QueryClientProvider>
  )
}

function AppContent() {
  const colorScheme = useColorScheme()
  const user = useBoundStore(state => state.user)
  const sipAccount = useBoundStore(state => state.sipAccount)
  const setSipAccount = useBoundStore(state => state.setSipAccount)

  const isDarkTheme = colorScheme === 'dark'
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme

  useQuery<SipAccount>({
    queryKey: [
      `/v1/agents/users/${user?.username}/sip-account?customerId=${user?.agreementID}`
    ],
    enabled: !!user,
    onSuccess: async data => {
      setSipAccount(data)
      if (user?.firebaseAccessToken) {
        await auth().signInWithCustomToken(user.firebaseAccessToken)
      }
      await BootSplash.hide({ fade: true })
    },
    onError: async () => {
      setSipAccount(null)
      await BootSplash.hide({ fade: true })
    }
  })

  // Debug
  useEffect(() => {
    BootSplash.hide({ fade: true })
  }, [])

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />

        <NavigationContainer theme={theme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            {sipAccount ? (
              <Stack.Screen name="main" component={MainTabs} />
            ) : (
              <Stack.Screen name="auth" component={AuthStacks} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
