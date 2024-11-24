import { CRMConnectConfig } from './PhoneBook'

export interface Account {
  username: string
  password: string
  isRemembered: string
}

export class Token {
  firebaseToken: string
  accessToken: string
  createdAt: number

  constructor(accessToken: string, firebaseToken: string) {
    this.firebaseToken = firebaseToken
    this.accessToken = accessToken
    this.createdAt = Date.now()
  }
}
export interface ClientAppLicenseInterface {
  limitSipAccount: number
}

export class AuthUser {
  companyId?: string
  username: string
  roles: string[]
  id: number
  name: string
  customerID: string
  infinitalkCustomerId: string
  clientAppLicense: ClientAppLicenseInterface
  token: Token
  publicAvatarUrl?: string

  constructor(
    id: number,
    accessToken: Token,
    username: string,
    roles: string[],
    name: string,
    customerID: string,
    infinitalkCustomerId: string,
    clientAppLicense: ClientAppLicenseInterface,
    companyId?: string,
    publicAvatarUrl?: string
  ) {
    this.username = username
    this.roles = roles
    this.id = id
    this.name = name
    this.customerID = customerID
    this.infinitalkCustomerId = infinitalkCustomerId
    this.token = accessToken
    this.clientAppLicense = clientAppLicense
    this.companyId = companyId
    this.publicAvatarUrl = publicAvatarUrl
  }
}

export enum Role {
  'op:normal' = 'op:normal',
  'infinitalk:manager' = 'infinitalk:manager',
  'infinitalk:normal' = 'infinitalk:normal',
  'chat:normal' = 'chat:normal',
  'sms:normal' = 'sms:normal',
  'soft-phone:normal' = 'soft-phone:normal',
  'chat-outside:normal' = 'chat-outside:normal',
  'gpt:normal' = 'gpt:normal'
}

export interface AccountInfo {
  id: number
  username: string
  name: string
  agreementID: string
  activate: boolean
  roles: Role[]
  infinitalkDomain?: string
  createdAt: string
  description?: string
  chatBetweenOperator?: boolean
}

export type AccountList = AccountInfo[]

export interface CRMSetting {
  phoneNumbers?: string[]
  phoneNumberPrefix?: string
  crmConnectConfig?: CRMConnectConfig
}

export interface SpeedDial {
  contactId: string
  shortName: string
  phoneNumber: string
  prefix: string
}

export interface DefaultState {
  userId: number
  localization: string
}

export interface CallRequest {
  phoneNumber: string
  isOutbound: boolean
}
