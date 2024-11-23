import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { TokenBulk } from '../types'
import { TOKEN_KEYS } from '../constants'

export const storeTokens = async (tokenBundle: TokenBulk): Promise<void> => {
  await Promise.all([
    RNSecureStorage.setItem(TOKEN_KEYS.accessToken, tokenBundle.accessToken, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    }),
    RNSecureStorage.setItem(TOKEN_KEYS.refreshToken, tokenBundle.refreshToken, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    })
  ])
}

export const getTokens = async (): Promise<TokenBulk> => {
  const accessToken: string | null = await RNSecureStorage.getItem(
    TOKEN_KEYS.accessToken
  ).catch(() => null)

  const refreshToken: string | null = await RNSecureStorage.getItem(
    TOKEN_KEYS.refreshToken
  ).catch(() => null)

  return { refreshToken: refreshToken || '', accessToken: accessToken || '' }
}

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    RNSecureStorage.removeItem(TOKEN_KEYS.accessToken),
    RNSecureStorage.removeItem(TOKEN_KEYS.refreshToken)
  ])
}
