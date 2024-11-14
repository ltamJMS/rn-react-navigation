import React, { useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native'
import { useRecoilState } from 'recoil'
import { agentsState } from '../../services/store/agentStatus'
import { getAgents, listenAgentStatuses } from '../../services/agentStatus'
import useAuth from '../../services/usecases/auth/useAuth'
import AgentList from './AgentList'
import { styles } from './styles'
import AgentStatus from '../../services/models/softPhone'

const AgentMemberScreen = () => {
  const auth = useAuth()
  const [agents, setAgents] = useRecoilState(agentsState)

  const fetchAndSetAgents = useCallback(async () => {
    if (!auth) return
    const customerId =
      auth.customerID.startsWith('CRM') && auth.infinitalkCustomerId
        ? auth.infinitalkCustomerId
        : auth.customerID
    const data = await getAgents(customerId)
    setAgents(data)
  }, [auth, setAgents])

  useEffect(() => {
    if (auth) fetchAndSetAgents()
  }, [auth, fetchAndSetAgents])

  const updateAgentStatus = useCallback(
    (agent: AgentStatus) =>
      setAgents(prev => ({ ...prev, [agent.userID]: agent })),
    [setAgents]
  )

  const removeAgent = useCallback(
    (condition: Partial<AgentStatus>) =>
      setAgents(prev => {
        if (condition.userID) {
          const { [condition.userID]: _, ...rest } = prev // Using rest to remove agent
          return rest
        }
        return prev
      }),
    [setAgents]
  )

  useEffect(() => {
    if (!auth) return

    const unsubscribe = listenAgentStatuses(
      auth.customerID.startsWith('CRM') && auth.infinitalkCustomerId
        ? auth.infinitalkCustomerId
        : auth.customerID,
      {
        onAdded: updateAgentStatus,
        onModified: updateAgentStatus,
        onRemoved: removeAgent
      }
    )

    return () => unsubscribe()
  }, [auth, updateAgentStatus, removeAgent])

  return (
    <SafeAreaView style={styles.container}>
      <AgentList agents={agents} />
    </SafeAreaView>
  )
}

export default AgentMemberScreen
