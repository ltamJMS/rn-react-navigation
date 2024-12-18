import { StateCreator } from 'zustand'

import { BoundState } from '.'

export type AuthState = {
  logout: () => void
}

export const createAuthSlice: StateCreator<BoundState, [], [], AuthState> = (
  set
) => ({
  logout: () => set({ user: null, sipAccount: null })
})
