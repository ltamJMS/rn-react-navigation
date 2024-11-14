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
