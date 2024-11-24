import React from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import merge from 'deepmerge'
import BootSplash from 'react-native-bootsplash'
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider
} from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useFirestore from './hooks/useFirestore'
import { useQuery } from './hooks/useQuery'
import AuthStacks from './navigators/AuthStacks'
import MainTabs from './navigators/MainTabs'
import useBoundStore from './stores'
import { SipAccount } from './types'
import NetworkLogger from 'react-native-network-logger'
import useSoftPhone from './hooks/useSoftPhone'

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
      {/* <NetworkLogger /> */}
    </QueryClientProvider>
  )
}

function AppContent() {
  const colorScheme = useColorScheme()
  const user = useBoundStore(state => state.user)
  const isAuthenticated = useBoundStore(state => state.softPhone)
  const createSoftPhone = useBoundStore(state => state.createSoftPhone)

  useFirestore()
  useSoftPhone()

  useQuery<SipAccount>({
    queryKey: [
      `/v1/agents/users/${user?.username}/sip-account?customerId=${user?.agreementID}`
    ],
    enabled: !!user,
    onSuccess: async data => {
      createSoftPhone(data)
      await BootSplash.hide({ fade: true })
    },
    onError: async () => {
      await BootSplash.hide({ fade: true })
    }
  })

  const isDarkTheme = colorScheme === 'dark'
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme

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
            {isAuthenticated ? (
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
