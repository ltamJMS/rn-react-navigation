import { atom } from 'recoil'
import { AuthUser } from '../models/account'

export const authState = atom<AuthUser | undefined>({
  key: 'authState',
  default: undefined
})

export const sipAccountState = atom<any>({
  key: 'sipAccountState',
  default: undefined
})
