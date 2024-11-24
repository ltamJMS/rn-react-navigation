import { atom } from 'recoil'
import { SoftPhoneCallInfo } from '../models/softPhone'
import { CallRequest, SpeedDial } from '../models/account'

export const incomingShowState = atom<boolean>({
  key: 'incomingShowState',
  default: false
})

export const currentCallState = atom<SoftPhoneCallInfo | undefined>({
  key: 'currentCallState',
  default: undefined
})

export const holdingCallState = atom<SoftPhoneCallInfo | undefined>({
  key: 'holdingCallState',
  default: undefined
})

export const agentLoginState = atom<boolean>({
  key: 'agentLoginState',
  default: false
})

export const canSFRegisterState = atom<boolean>({
  key: 'canSFRegisterState',
  default: false
})

export const callRequestState = atom<CallRequest>({
  key: 'callRequestState',
  default: {
    phoneNumber: '',
    isOutbound: false
  }
})
