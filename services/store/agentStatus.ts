import { atom, selector } from 'recoil'
import { Account, AgentStatusMap } from '../models/softPhone'
import { GroupData } from '../models/Group'
import { authState, currentUserState } from './auth'

const initState: AgentStatusMap = {}

export const sipAccountsMapNameState = atom<Account[]>({
  key: 'sipAccountsMapNameState',
  default: []
})

export const agentStatusesState = atom<AgentStatusMap>({
  key: 'agentStatusesSate',
  default: initState
})

export const groupsState = atom<GroupData>({
  key: 'groupsState',
  default: {}
})

export const agentsState = atom<AgentStatusMap>({
  key: 'agentsState',
  default: initState
})
