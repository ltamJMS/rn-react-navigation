import firestore from '@react-native-firebase/firestore'
import { useEffect } from 'react'
import useBoundStore from '../stores'
import { Agent, Customer } from '../types'
import auth from '@react-native-firebase/auth'

export default function useFirestore() {
  const user = useBoundStore(state => state.user)
  const setCustomer = useBoundStore(state => state.setCustomer)
  const setAgents = useBoundStore(state => state.setAgents)
  const setCurrentAgent = useBoundStore(state => state.setCurrentAgent)

  const customerId = user?.customerId
  const userName = user?.username
  const customToken = user?.firebaseAccessToken

  useEffect(() => {
    if (!customerId || !customToken) {
      return undefined
    }

    let agentSubscriber: Function | undefined
    let customerSubscriber: Function | undefined

    const initialize = async () => {
      try {
        await auth().signInWithCustomToken(customToken)

        agentSubscriber = firestore()
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

        customerSubscriber = firestore()
          .collection('customers')
          .doc(customerId)
          .onSnapshot(customerQuerySnapshot => {
            const customer = customerQuerySnapshot.data() as Customer

            setCustomer(customer)
          })
      } catch (error) {
        // do something
      }
    }

    initialize()

    return () => {
      agentSubscriber && agentSubscriber()
      customerSubscriber && customerSubscriber()
    }
  }, [
    customerId,
    userName,
    customToken,
    setAgents,
    setCustomer,
    setCurrentAgent
  ])
}
