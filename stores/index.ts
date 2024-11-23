import { create } from 'zustand'
import createUserSlice, { UserState } from './user_slice'
import createSipAccountSlice, { SipAccountState } from './sipaccount_slice'
import {
  AuthenticateState,
  createAuthenticateSlice
} from './authenticate_slice'

export type BoundState = UserState & SipAccountState & AuthenticateState

const useBoundStore = create<BoundState>((...args) => ({
  ...createUserSlice(...args),
  ...createSipAccountSlice(...args),
  ...createAuthenticateSlice(...args)
}))

export default useBoundStore
