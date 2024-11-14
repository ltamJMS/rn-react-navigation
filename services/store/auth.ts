import { atom } from 'recoil'
import { AuthUser } from '../models/account'
import User from '../models/User'

export const authState = atom<AuthUser | undefined>({
  key: 'authState',
  default: undefined
})

export const sipAccountState = atom<any>({
  key: 'sipAccountState',
  default: undefined
})

export const currentUserState = atom<User | null>({
  key: 'currentUserState',
  default: null
})
