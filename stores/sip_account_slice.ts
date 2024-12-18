import { StateCreator } from 'zustand'

import { SipAccount } from '../types'

export type SipAccountState = {
  sipAccount: SipAccount | null
  setSipAccount: (sipAccount: SipAccount) => void
}

const createSipAccountSlice: StateCreator<SipAccountState> = (set) => ({
  sipAccount: null,
  setSipAccount: (sipAccount: SipAccount) => set({ sipAccount })
})

export default createSipAccountSlice
