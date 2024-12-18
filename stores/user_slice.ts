import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from 'types'
import { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'

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
    setUser: (user: User) => {
      const customerId =
        user.agreementID.startsWith('CRM') && user.infinitalkCustomerId
          ? user.infinitalkCustomerId
          : user.agreementID
      const serverNumber = customerId.slice(0, 3)

      set({ user: { ...user, customerId, serverNumber } })
    }
  }),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => AsyncStorage)
  }
)

export default createUserSlice
