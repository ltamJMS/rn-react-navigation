import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authState, currentUserState } from '../../store/auth'
import { contextsState, tenantState } from '../../store/tenant'
import { useCallback, useEffect } from 'react'
import Tenant from '../../models/Tenant'
import AgentStatus from '../../models/softPhone'
import { Context } from '../../models/Context'
import { listenContexts } from './context'
import { listenAgentStatus } from '../../agentStatus'
import { listenTenant } from './tenant'
import { agentsState } from '../../store/agentStatus'

const useCommonData = () => {
  const auth = useRecoilValue(authState)
  const setCurrentUser = useSetRecoilState(currentUserState)
  const setTenant = useSetRecoilState(tenantState)
  const agents = useRecoilValue(agentsState)
  const setContexts = useSetRecoilState(contextsState)
  const handleGotTenant = useCallback((t: Tenant) => setTenant(t), [setTenant])
  const handleAddOrModifyAS = useCallback(
    (as: AgentStatus) => {
      setCurrentUser(val => {
        if (!val) {
          return val
        }

        return { ...val, agentStatus: as }
      })
    },
    [setCurrentUser]
  )
  const handleRemoveAS = useCallback(() => {
    setCurrentUser(val => {
      if (!val) {
        return val
      }

      const clone = { ...val }
      delete clone.agentStatus
      return clone
    })
  }, [setCurrentUser])

  const handleChangeContext = useCallback(
    (updateContext: Context) => {
      setContexts(data => {
        if (!data) {
          return data
        }
        return { ...data, [updateContext.name]: updateContext }
      })
    },
    [setContexts]
  )

  const handleDeleteContext = useCallback(
    (context: Partial<Context>) => {
      setContexts(data => {
        const clone = { ...data }
        if (context && context.name && clone[context.name])
          delete clone[context.name]
        return clone
      })
    },
    [setContexts]
  )

  useEffect(() => {
    console.log('🌵 🌵 🌵 🌵 agents', agents)
  }, [agents])
  useEffect(() => {
    if (!auth) {
      return
    }

    setCurrentUser(val => ({
      ...val,
      name: auth.name,
      username: auth.username,
      infinitalkCustomerId: auth.infinitalkCustomerId,
      customerID: auth.customerID,
      publicAvatarUrl: auth.publicAvatarUrl
    }))
    const unsubscribeTenant = listenTenant(
      auth.customerID.startsWith('CRM') && auth.infinitalkCustomerId
        ? auth.infinitalkCustomerId
        : auth.customerID,
      {
        onData: handleGotTenant
      }
    )
    const unsubscribeAgentStatus = listenAgentStatus(
      auth.customerID.startsWith('CRM') && auth.infinitalkCustomerId
        ? auth.infinitalkCustomerId
        : auth.customerID,
      { username: auth.username },
      {
        onAdded: handleAddOrModifyAS,
        onModified: handleAddOrModifyAS,
        onRemoved: handleRemoveAS
      }
    )

    const unsubscribeListenContext = listenContexts(
      auth.customerID.startsWith('CRM') && auth.infinitalkCustomerId
        ? auth.infinitalkCustomerId
        : auth.customerID,
      {
        onAdded: handleChangeContext,
        onModified: handleChangeContext,
        onRemoved: handleDeleteContext
      }
    )

    return () => {
      unsubscribeTenant()
      unsubscribeAgentStatus()
      unsubscribeListenContext()
    }
  }, [
    auth,
    handleGotTenant,
    setCurrentUser,
    handleRemoveAS,
    handleAddOrModifyAS,
    handleChangeContext,
    handleDeleteContext
  ])
}

export default useCommonData
