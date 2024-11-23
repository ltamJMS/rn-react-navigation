import firestore from '@react-native-firebase/firestore'
import { useEffect } from 'react'
import useBoundStore from '../stores'
import { Agent, Customer } from '../types'

export default function useFirestore() {
  const user = useBoundStore(state => state.user)
  const setCustomer = useBoundStore(state => state.setCustomer)
  const setAgents = useBoundStore(state => state.setAgents)
  const setCurrentAgent = useBoundStore(state => state.setCurrentAgent)

  const customerId = user?.customerId
  const userName = user?.username

  useEffect(() => {
    if (!customerId) {
      return undefined
    }

    const agentSubscriber = firestore()
      .collection('customers')
      .doc(customerId)
      .collection('agentStatuses')
      .onSnapshot(agentQuerySnapshot => {
        const data: Agent[] = []
        agentQuerySnapshot.forEach(agentsDocumentSnapshot => {
          const agent = agentsDocumentSnapshot.data() as Agent
          data.push(agent)

          if (agent.username === userName) {
            setCurrentAgent(agent)
          }
        })

        setAgents(data)
      })

    const customerSubscriber = firestore()
      .collection('customers')
      .doc(customerId)
      .onSnapshot(customerQuerySnapshot => {
        const customer = customerQuerySnapshot.data() as Customer

        setCustomer(customer)
      })

    return () => {
      agentSubscriber()
      customerSubscriber()
    }
  }, [customerId, userName, setAgents, setCustomer, setCurrentAgent])
}
