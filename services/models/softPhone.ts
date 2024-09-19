import { RTCSession } from 'jssip/lib/RTCSession'

export interface InfiTalkRTCSession {
  onInfTerminate: (() => void)[]
  infStopStream?: () => void
}

export interface CallEventEmitterPayload<T> {
  event: string
  sessionId: string
  data?: T
}

export interface InfinitalkCallConfig {
  listenCall?: boolean
}

export interface UAEventEmitterPayload<T> {
  event: string
  data?: T
}

export interface InfinitalkSIPConfig {
  uaOptions?: any
  listenCall?: boolean
  listenUA?: boolean
}

export interface SipConfig {
  account: string
  password: string
  domain: string
  port: number
}

export interface CallSession {
  session: RTCSession
  type: CallSessionType
  removeListener?: () => void
}

export enum CallSessionType {
  CURRENT = 'current',
  HOLD = 'hold',
  INCOMING_WAITING = 'incoming_waiting'
}

export interface CallSession {
  session: RTCSession
  type: CallSessionType
  removeListener?: () => void
}

export enum SoftPhoneCallState {
  'RECEIVING' = '受信中',
  'CALLING' = '発信中',
  'WAITING' = '呼出中',
  'TALKING' = '通話中',
  'END' = '通話終了',
  'HOLD' = '保留中'
}

export enum CallDirection {
  'INCOMING' = 'INCOMING',
  'OUTGOING' = 'OUTGOING'
}

export interface SoftPhoneActor {
  num: string
  displayName?: string
  groupName?: string
}

export interface SoftPhoneCallInfo {
  direction: CallDirection
  dst: SoftPhoneActor
  src: SoftPhoneActor
  state: SoftPhoneCallState
  sessionId: string
  callConfirmTime?: Date
  callEndTime?: Date
  media?: any
  error?: string
  muted?: boolean
}

export interface IncomingUserInfo {
  displayName: string
  userName: string
}

export interface CallSessionMap {
  [index: string]: CallSession
}

export enum AgentType {
  'MANAGER' = 3,
  'NORMAL' = 1
}

interface AgentStatus {
  userID: number
  name: string
  type: AgentType
  username?: string
  exten?: string
  sipAccount?: string
  contextName: string
  groupNames: string[]
  interface: string
  status?: number
  phoneStatus?: number
  updateTime?: Date
  raiseHandAt?: Date
  contextPrefix?: number
}

export type AgentStatusMap = {
  [index: string]: AgentStatus
}
export default AgentStatus
