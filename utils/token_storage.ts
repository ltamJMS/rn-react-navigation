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
  try {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEYS.accessToken),
      AsyncStorage.getItem(TOKEN_KEYS.refreshToken)
    ])

    return {
      refreshToken: refreshToken || '',
      accessToken: accessToken || ''
    }
  } catch (error: unknown) {
    return {
      refreshToken: '',
      accessToken: ''
    }
  }
}

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEYS.accessToken),
    AsyncStorage.removeItem(TOKEN_KEYS.refreshToken)
  ])
}
