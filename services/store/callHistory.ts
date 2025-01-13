// https://asia-northeast1-development-201811.cloudfunctions.net/callHistoryApiFunction
import { atom } from 'recoil'
export const callHistoryData = atom<any[]>({
  key: 'callHistoryData',
  default: []
})
