export interface Group {
  id: number
  name: string
  dispName: string
  callWaitTime: number
  callWaiting: number
  chatAccountIds?: string[]
}

export interface GroupSelectable {
  id: number
  name: string
  dispName: string
  callWaitTime: number
  callWaiting: string
}

export type GroupData = { [index: string]: Group }
