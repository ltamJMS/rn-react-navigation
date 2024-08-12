import { create } from 'zustand'
import createUserSlice, { UserState } from './userSlice'

type BoundState = UserState

const useBoundStore = create<BoundState>((...args) => ({
  ...createUserSlice(...args)
}))

export default useBoundStore
