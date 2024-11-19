export enum TIMING_TYPE {
  RINGING = 'RINGING',
  CALLING = 'CALLING'
}

export enum CALL_DIRECTION {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING'
}

export enum CALL_TIMING {
  ON_PROGRESS = 'ON_PROGRESS',
  ACCEPTED = 'ACCEPTED'
}

export class LinkedIdData {
  direction!: CALL_DIRECTION
  timing!: CALL_TIMING
  event!: string
  sipAccount!: string
  linkedId!: string
  context!: string
  groupPhoneNumber?: string
  customerPhoneNumber!: string
  displayInfo?: string
}

export enum CRM_PROVIDER {
  INFINITALK_PHONE_BOOK = 'INFINITALK_PHONE_BOOK',
  THIRD_PARTY = 'THIRD_PARTY',
  NONE = 'NONE'
}

export interface CRMConnectConfig {
  provider: CRM_PROVIDER
  callDirection?: CALL_DIRECTION[]
  incomingTiming?: CALL_TIMING
  outgoingTiming?: CALL_TIMING
  crmURL?: string
}

export interface CRMConnnectConfigMap {
  // index = phoneNumber-direction-timing
  [index: string]: CRMConnectConfig
}
