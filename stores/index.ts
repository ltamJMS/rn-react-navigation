import { create } from 'zustand'
import createUserSlice, { UserState } from './user_slice'
import createSipAccountSlice, { SipAccountState } from './sipaccount_slice'
import {
  AuthenticateState,
  createAuthenticateSlice
} from './authenticate_slice'
import createFirestoreSlice, { FirestoreState } from './firestore_slice'

export type BoundState = UserState &
  SipAccountState &
  AuthenticateState &
  FirestoreState

const useBoundStore = create<BoundState>((...args) => ({
  ...createUserSlice(...args),
  ...createSipAccountSlice(...args),
  ...createAuthenticateSlice(...args),
  ...createFirestoreSlice(...args)
}))

export default useBoundStore
