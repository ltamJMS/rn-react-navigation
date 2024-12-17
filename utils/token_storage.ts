import AsyncStorage from '@react-native-async-storage/async-storage'

import { TOKEN_KEYS } from '../constants'
import { TokenBulk } from '../types'

export const storeTokens = async (tokenBundle: TokenBulk): Promise<void> => {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEYS.accessToken, tokenBundle.accessToken),
    AsyncStorage.setItem(TOKEN_KEYS.refreshToken, tokenBundle.refreshToken)
  ])
}

export const getTokens = async (): Promise<TokenBulk> => {
  const accessToken: string | null = await AsyncStorage.getItem(
    TOKEN_KEYS.accessToken
  ).catch(() => null)

  const refreshToken: string | null = await AsyncStorage.getItem(
    TOKEN_KEYS.refreshToken
  ).catch(() => null)

  return { refreshToken: refreshToken || '', accessToken: accessToken || '' }
}

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEYS.accessToken),
    AsyncStorage.removeItem(TOKEN_KEYS.refreshToken)
  ])
}
