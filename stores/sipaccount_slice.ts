import { StateCreator } from 'zustand'
import { SipAccount } from '../types'

export type SipAccountState = {
  sipAccount: SipAccount | null
  setSipAccount: (sipAccount: SipAccount | null) => void
}

const createSipAccountSlice: StateCreator<SipAccountState> = set => ({
  sipAccount: null,
  setSipAccount: (sipAccount: SipAccount | null) => set({ sipAccount })
})

export default createSipAccountSlice
