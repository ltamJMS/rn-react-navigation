import { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isWebRTCUserState } from '../../store/agentStatus'
import { currentUserState, sipAccountState } from '../../store/auth'
import { logoutAgent } from '../../agentStatus'
import { useSoftPhone } from './useSoftPhone'

const useLogoutAgent = (options: { unregisterSip: boolean }) => {
  const { unregisterSip = false } = options
  const [currentUser] = useRecoilState(currentUserState)
  const [isWebRTCUser] = useRecoilState(isWebRTCUserState)
  const { handleUnregisterSip } = useSoftPhone()
  const sipAccountData = useRecoilValue(sipAccountState)

  return useCallback(async (): Promise<{ success: boolean } | undefined> => {
    if (
      !currentUser?.customerID ||
      !sipAccountData ||
      !sipAccountData?.agent ||
      !isWebRTCUser // logout agent not support SAXA, infinitalk phone
    ) {
      return { success: false }
    }

    try {
      // unregister sip if require
      if (unregisterSip) {
        handleUnregisterSip()
      }

      // will need to wait a few seconds after unregister sip
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Call api to logout agent
      const { sipAccount, domain, agent } = sipAccountData
      const res = await logoutAgent(sipAccount, agent.agentAccount, domain)

      if (res.success) {
        return { success: true }
      } else {
        return { success: false }
      }
    } catch (error: any) {
      return { success: false }
    }
  }, [
    currentUser?.customerID,
    handleUnregisterSip,
    isWebRTCUser,
    sipAccountData,
    unregisterSip
  ])
}

export default useLogoutAgent
