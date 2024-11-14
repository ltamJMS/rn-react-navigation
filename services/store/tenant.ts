import { atom } from 'recoil'
import Tenant from '../models/Tenant'
import { ContextData } from '../models/Context'

export const tenantState = atom<Tenant | null>({
  key: 'tenantState',
  default: null
})

export const contextsState = atom<ContextData>({
  key: 'contextsState',
  default: {}
})
