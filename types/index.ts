export type User = {
  accountID: number
  accessToken: string
  firebaseAccessToken: string
  agreementID: string
  username: string
  name: string
  roles: string[]
  activate: boolean
  publicAvatarUrl: string
  infinitalkCustomerId: string
  customerId: string
  serverNumber: string
}

export type TokenBulk = {
  accessToken: string
  refreshToken: string
}

export type SipAccount = {
  agent: {
    agentAccount: string
    agentPassword: string
  }
  domain: string
  sipAccount: string
  sipPassword: string
  sipType: string
  transport: string
}

export type Agent = {
  contextName: string
  contextPrefix: string
  exten: string
  groupNames: string[]
  interface: string
  name: string
  phoneStatus: number
  status: number
  type: number
  userID: number
  username: string
}

export type AgentStatusText = {
  [index: string]: string
}

export type Customer = {
  id: number
  customerID: string
  agentStatusText: AgentStatusText
}

export type Status = {
  value: string
  label: string
}

export type ChangeStatusFormValues = {
  Action: string
  Queue?: string
  Interface?: string
  Paused: string
  Reason: string
}

export type LoginAgentFormValues = {
  sipaccount?: string
  sippassword?: string
  account?: string
  password?: string
  webrtcflg: numer
}
