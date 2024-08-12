import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
export type TokenBundle = {
  accessToken: string
  refreshToken: string
}

export const storeTokens = async (tokenBundle: TokenBundle): Promise<void> => {
  await Promise.all([
    RNSecureStorage.setItem('access_token', tokenBundle.accessToken, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    }),
    RNSecureStorage.setItem('refresh_token', tokenBundle.refreshToken, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    })
  ])
}

export const getTokens = async (): Promise<TokenBundle> => {
  const accessToken: string | null = await RNSecureStorage.getItem(
    'access_token'
  ).catch(() => null)

  const refreshToken: string | null = await RNSecureStorage.getItem(
    'refresh_token'
  ).catch(() => null)

  return { refreshToken: refreshToken || '', accessToken: accessToken || '' }
}

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    RNSecureStorage.removeItem('access_token'),
    RNSecureStorage.removeItem('refresh_token')
  ])
}

export const getErrorMessage = (error: unknown) => {
  let message: string

  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Something went wrong'
  }

  return message
}
