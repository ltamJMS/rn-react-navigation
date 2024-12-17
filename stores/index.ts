import { create } from 'zustand'

import {
  AuthenticateState,
  createAuthenticateSlice
} from './authenticate_slice'
import createFirestoreSlice, { FirestoreState } from './firestore_slice'
import createSoftPhoneSlice, { SoftPhoneState } from './softphone_slice'
import createUserSlice, { UserState } from './user_slice'

export type BoundState = UserState &
  SoftPhoneState &
  AuthenticateState &
  FirestoreState

const useBoundStore = create<BoundState>((...args) => ({
  ...createUserSlice(...args),
  ...createSoftPhoneSlice(...args),
  ...createAuthenticateSlice(...args),
  ...createFirestoreSlice(...args)
}))

export default useBoundStore
