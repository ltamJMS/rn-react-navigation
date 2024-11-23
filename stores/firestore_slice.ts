import { StateCreator } from 'zustand'
import { Agent, Customer } from '../types'

export type FirestoreState = {
  customer: Customer | null
  agents: Agent[]
  currentAgent: Agent | null
  setCustomer: (customer: Customer | null) => void
  setAgents: (agents: Agent[]) => void
  setCurrentAgent: (agent: Agent) => void
}

const createFirestoreSlice: StateCreator<FirestoreState> = set => ({
  customer: null,
  agents: [],
  currentAgent: null,
  setCustomer: (customer: Customer | null) => set({ customer }),
  setAgents: (agents: Agent[]) => set({ agents }),
  setCurrentAgent: (agent: Agent) => set({ currentAgent: agent })
})

export default createFirestoreSlice
