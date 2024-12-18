import { create } from 'zustand'

import { AuthState, createAuthSlice } from './auth_slice'
import createSipAccountSlice, { SipAccountState } from './sip_account_slice'
import createUserSlice, { UserState } from './user_slice'

export type BoundState = UserState & SipAccountState & AuthState

const useBoundStore = create<BoundState>((...args) => ({
  ...createUserSlice(...args),
  ...createSipAccountSlice(...args),
  ...createAuthSlice(...args)
}))

export default useBoundStore
