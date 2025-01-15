import axios from 'axios'
import { useCallback, useMemo } from 'react'
import { useResetRecoilState } from 'recoil'
import * as NavigationService from 'react-navigation-helpers'
import { authState, currentUserState, sipAccountState } from '../../store/auth'
import {
  agentLoginState,
  callRequestState,
  canSFRegisterState,
  currentCallState,
  holdingCallState,
  incomingShowState
} from '../../store/softphone'
import { SCREENS } from '../../../shared/constants'
import {
  agentsState,
  agentStatusesState,
  isWebRTCUserState,
  SFActiveButtonState,
  sipAccountsAvailableState
} from '../../store/agentStatus'
import { contextsState, tenantState } from '../../store/tenant'
import { callHistoryData } from '../../store/callHistory'

const useLogout = () => {
  // agentStatus store
  const resetAgentsState = useResetRecoilState(agentsState)
  const resetAgentStatusesState = useResetRecoilState(agentStatusesState)
  const resetIsWebRTCUserState = useResetRecoilState(isWebRTCUserState)
  const resetSipAccountsAvailableState = useResetRecoilState(
    sipAccountsAvailableState
  )
  const resetSFActiveButtonState = useResetRecoilState(SFActiveButtonState)
  // auth store
  const resetAuth = useResetRecoilState(authState)
  const resetAgentLogin = useResetRecoilState(agentLoginState)
  const resetCurrentUserState = useResetRecoilState(currentUserState)
  // callHistory store
  const resetCallHistoryData = useResetRecoilState(callHistoryData)
  // softphone store
  const resetSipAccount = useResetRecoilState(sipAccountState)
  const resetIncomingShow = useResetRecoilState(incomingShowState)
  const resetCurrentCall = useResetRecoilState(currentCallState)
  const resetHoldingCall = useResetRecoilState(holdingCallState)
  const resetCanSFRegisterState = useResetRecoilState(canSFRegisterState)
  const resetCallRequestState = useResetRecoilState(callRequestState)
  // tenant store
  const resetTenantState = useResetRecoilState(tenantState)
  const resetContextsState = useResetRecoilState(contextsState)
  const resetStore = useMemo(() => {
    return () => {
      // agentStatus store
      resetAgentsState()
      resetAgentStatusesState()
      resetIsWebRTCUserState()
      resetSipAccountsAvailableState()
      resetSFActiveButtonState()
      // auth store
      resetAuth()
      resetAgentLogin()
      resetCurrentUserState()
      // softphone store
      resetSipAccount()
      resetIncomingShow()
      resetCurrentCall()
      resetHoldingCall()
      resetCanSFRegisterState()
      resetCallRequestState()
      resetCallHistoryData()
      // tenant store
      resetTenantState()
      resetContextsState()
    }
  }, [
    // agentStatus store
    resetAgentsState,
    resetAgentStatusesState,
    resetIsWebRTCUserState,
    resetSipAccountsAvailableState,
    resetSFActiveButtonState,
    // auth store
    resetAuth,
    resetAgentLogin,
    resetCurrentUserState,
    // softphone store
    resetCurrentCall,
    resetHoldingCall,
    resetIncomingShow,
    resetSipAccount,
    resetCanSFRegisterState,
    resetCallRequestState,
    resetCallHistoryData,
    // tenant store
    resetTenantState,
    resetContextsState
  ])

  return useCallback(async () => {
    try {
      const asyncJob: Promise<unknown>[] = []
      resetStore()
      delete axios.defaults.headers.common.Authorization
      await Promise.all(asyncJob)
    } catch (err) {
      console.error('🔴 LOGOUT ERROR', err)
    } finally {
      NavigationService.navigate(SCREENS.LOGIN)
    }
  }, [resetStore])
}

export default useLogout
