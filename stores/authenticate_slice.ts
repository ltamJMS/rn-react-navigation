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
> = (set, get) => ({
  authenticate: (user: User) => {
    const customerId =
      user.agreementID.startsWith('CRM') && user.infinitalkCustomerId
        ? user.infinitalkCustomerId
        : user.agreementID

    const serverNumber = customerId.slice(0, 3)

    storeTokens({ accessToken: user.accessToken, refreshToken: '' })
    get().setUser({ ...user, customerId, serverNumber })
  },
  unAuthenticate: () => {
    set({ user: null, sipAccount: null, softPhone: null })
    clearTokens()
  }
})
