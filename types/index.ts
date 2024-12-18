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

export type IconProps = {
  color: string
  size: number
}
