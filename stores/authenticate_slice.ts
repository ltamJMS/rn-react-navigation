import { StateCreator } from 'zustand'
import { User } from '../types'
import { clearTokens, storeTokens } from '../utils/token_storage'
import { BoundState } from '.'

export type AuthenticateState = {
  authenticate: (user: User) => void
  unAuthenticate: () => void
}

export const createAuthenticateSlice: StateCreator<
  BoundState,
  [],
  [],
  AuthenticateState
> = (_set, get) => ({
  authenticate: (user: User) => {
    storeTokens({ accessToken: user.accessToken, refreshToken: '' })
    get().setUser(user)
  },
  unAuthenticate: () => {
    get().setSipAccount(null)
    get().setUser(null)
    clearTokens()
  }
})
