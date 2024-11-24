import { StateCreator } from 'zustand'
import { SipAccount } from '../types'
import { createUA } from '../libs/js_sip'
import { UA } from 'jssip'
import { UnRegisterOptions } from 'jssip/lib/UA'
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription
} from 'react-native-webrtc-web-shim'

declare var global: {
  RTCPeerConnection: unknown
  RTCSessionDescription: unknown
  navigator: {
    mediaDevices: unknown
  }
}

global.RTCPeerConnection = RTCPeerConnection
global.RTCSessionDescription = RTCSessionDescription
global.navigator = {
  mediaDevices: mediaDevices
}

export type SoftPhoneState = {
  sipAccount: SipAccount | null
  softPhone: UA | null
  createSoftPhone: (sipAccount: SipAccount) => void
  register: () => void
  unregister: () => void
}

const createSoftPhoneSlice: StateCreator<SoftPhoneState> = (set, get) => ({
  sipAccount: null,
  softPhone: null,
  createSoftPhone: (sipAccount: SipAccount) => {
    const softPhone = createUA(sipAccount)
    softPhone.start()
    set({ sipAccount, softPhone })
  },
  register: () => {
    get().softPhone?.start()
  },
  unregister: (options?: UnRegisterOptions) => {
    get().softPhone?.unregister(options)
    get().softPhone?.stop()
  }
})

export default createSoftPhoneSlice
