import axios from 'axios'
import { useCallback, useMemo } from 'react'
import { useResetRecoilState } from 'recoil'
import {
  agentLoginState,
  currentCallState,
  holdingCallState,
  incomingShowState
} from '../../store/softphone'
import { authState, sipAccountState } from '../../store/auth'

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
      console.error(err)
    } finally {
      // navigation.navigate('Register')
    }
  }, [resetStore])
}

export default useLogout
