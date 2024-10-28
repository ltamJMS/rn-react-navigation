import axios from 'axios'
import { useCallback, useMemo } from 'react'
import { useResetRecoilState } from 'recoil'
import * as NavigationService from 'react-navigation-helpers'
import { authState, sipAccountState } from '../../store/auth'
import {
  agentLoginState,
  currentCallState,
  holdingCallState,
  incomingShowState
} from '../../store/softphone'
import { SCREENS } from '../../../shared/constants'

const useLogout = () => {
  const resetAuth = useResetRecoilState(authState)
  const resetAgentLogin = useResetRecoilState(agentLoginState)
  const resetSipAccount = useResetRecoilState(sipAccountState)
  const resetIncomingShow = useResetRecoilState(incomingShowState)
  const resetCurrentCall = useResetRecoilState(currentCallState)
  const resetHoldingCall = useResetRecoilState(holdingCallState)
  const resetStore = useMemo(() => {
    return () => {
      resetAuth()
      resetAgentLogin()
      resetSipAccount()
      resetIncomingShow()
      resetCurrentCall()
      resetHoldingCall()
    }
  }, [
    resetAgentLogin,
    resetAuth,
    resetCurrentCall,
    resetHoldingCall,
    resetIncomingShow,
    resetSipAccount
  ])

  return useCallback(async () => {
    try {
      const asyncJob: Promise<unknown>[] = []
      resetStore()
      delete axios.defaults.headers.common['Authorization']
      await Promise.all(asyncJob)
    } catch (err) {
      console.error('🔴 LOGOUT ERROR', err)
    } finally {
      NavigationService.navigate(SCREENS.LOGIN)
    }
  }, [resetStore])
}

export default useLogout
