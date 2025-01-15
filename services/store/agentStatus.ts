import { atom } from 'recoil'
import { Account, AgentStatusMap, CommonSip } from '../models/softPhone'
import { GroupData } from '../models/Group'

const initState: AgentStatusMap = {}

export const agentStatusesState = atom<AgentStatusMap>({
  key: 'agentStatusesSate',
  default: initState
})

export const agentsState = atom<AgentStatusMap>({
  key: 'agentsState',
  default: initState
})

export const isWebRTCUserState = atom<boolean>({
  key: 'isWebRTCUserState',
  default: false
})

export const sipAccountsAvailableState = atom<CommonSip[]>({
  key: 'sipAccountsAvailableState',
  default: []
})

export const SFActiveButtonState = atom<number | null>({
  key: 'SFActiveButtonState',
  default: null
})
