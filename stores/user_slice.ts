import { StateCreator } from 'zustand'
import { User } from '../types'

export type UserState = {
  user: User | null
  setUser: (user: User | null) => void
}

const createUserSlice: StateCreator<UserState> = set => ({
  user: null,
  setUser: (user: User | null) => set({ user })
})

export default createUserSlice
