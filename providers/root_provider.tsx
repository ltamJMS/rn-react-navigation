import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer
} from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import merge from 'deepmerge'
import { PropsWithChildren } from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider
} from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// import NetworkLogger from 'react-native-network-logger'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme
})

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

export default function RootProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme()

  const isDarkTheme = colorScheme === 'dark'
  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
            backgroundColor='transparent'
            translucent
          />

          <NavigationContainer theme={theme}>{children}</NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>

      {/* <NetworkLogger /> */}
    </QueryClientProvider>
  )
}
