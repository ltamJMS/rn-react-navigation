import AsyncStorage from '@react-native-async-storage/async-storage'
import { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'

import { User } from '../types'

export type UserState = {
  user: User | null
  setUser: (user: User) => void
}

type UserPersist = StateCreator<
  UserState,
  [],
  [['zustand/persist', unknown]],
  UserState
>

const createUserSlice: UserPersist = persist(
  (set) => ({
    user: null,
    setUser: (user: User) => set({ user })
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => AsyncStorage)
  }
)

export default createUserSlice
