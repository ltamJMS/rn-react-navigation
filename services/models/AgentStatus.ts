export interface AgentStatusText {
  [index: number]: string
}

export enum AgentType {
  'MANAGER' = 3,
  'NORMAL' = 1
}

export enum AgentStatusType {
  'WAITING',
  'CALLING',
  'OTHER',
  'LOGOUT'
}

interface AgentStatus {
  userID: number
  name: string
  type: AgentType
  username?: string
  exten?: string
  sipAccount?: string
  contextName: string
  groupNames?: string[]
  interface?: string
  status?: number
  phoneStatus?: number
  updateTime?: Date
  raiseHandAt?: Date
  contextPrefix?: number
}

export type AgentStatusMap = {
  [index: string]: AgentStatus
}

export interface StatusConfig {
  bgColorVal: string
  statusColor: string
  borderColor: string
  icon: string
  status?: AgentStatusType
}

export interface CommonSip {
  sipAccount: string
  sipPassword: string
  sipType?: string
  transport?: string
  agent?: {
    agentAccount: string
    agentPassword: string
  }
  domain: string
  asteriskDomain?: string
}

export interface Account {
  sipAccount: string
  name: string
  exten: string
}

export type AgentPermission = {
  sipDebugOn: boolean
  rtpDebugOn: boolean
}

export type AutomaticCall = {
  status: boolean
  timer: number
}

export type AutomaticAnswer = {
  status: boolean
  timer: number
}

export default AgentStatus
