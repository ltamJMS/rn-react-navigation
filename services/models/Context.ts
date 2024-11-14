export interface ContextOnlyName {
  name: string
  dispName: string
}

export interface AgentStatusThreshold {
  [index: number]: {
    threshold1: number
    threshold2: number
  }
}

export interface Context {
  dispName: string
  name: string
  agentStatusThreshold: AgentStatusThreshold
  seatMapConfigs: { [index: string]: any }
}

export type ContextData = { [index: string]: Context }
