import { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  isWebRTCUserState,
  sipAccountsAvailableState
} from '../../store/agentStatus'
import { authState } from '../../store/auth'
import {
  checkIsWebRTCUser,
  getListSipAccountsAvailable
} from '../../sipAccountRepo'
import { getSipAccount } from './auth'

export const useAgentStatusTool = () => {
  const auth = useRecoilValue(authState)
  const setSipAccountAvailable = useSetRecoilState(sipAccountsAvailableState)
  const [isWebRTCUser, setIsWebRTCUser] = useRecoilState(isWebRTCUserState)

  // check account is webrtc user or not
  useEffect(() => {
    if (!auth) return

    checkIsWebRTCUser(auth.customerID, auth.username).then(res => {
      if (!res.error) setIsWebRTCUser(res.data)
    })
  }, [auth, setIsWebRTCUser])

  // get and set rtc sip if is webrtc user
  useEffect(() => {
    if (!auth || !isWebRTCUser) {
      return
    }

    getSipAccount(auth.username, auth.customerID).then(result => {
      if (result.error) {
        let message = ''
        let description = ''

        switch (result.message) {
          case 'SIP_ACCOUNT_NOT_FOUND':
            message = 'SIP_ACCOUNT_NOT_FOUND'
            description = 'contactYourAdministrator'
            break
          case 'COMPANY_NOT_FOUND':
            message = 'COMPANY_NOT_FOUND'
            description = 'contactYourAdministratorCompany'
            break
          case 'SERVER_ERROR':
            message = 'SERVER_ERROR'
            description = result.error.message
            break
          default:
            message = 'errorHasOccurred'
            description = result.error.message
        }
        console.error('111111 GET SOFTPHONE SIP ERROR', message, description)
        return
      }
    })
  }, [auth, isWebRTCUser])

  // TODO: [next version] call api to get list sip accounts available if have not softphone sip
  // Note: current version does not support user other than webrtc user.
  // Infinitalk server needs to fix this ticket: http://yc2.infinitalk.co.jp/redmine/issues/7662

  useEffect(() => {
    if (!auth) return

    getListSipAccountsAvailable(auth.customerID, auth.username).then(result => {
      if (result.error) {
        console.error('🔴 GET SIP ACCOUNTS AVAILABLE ERROR', result.error)
      } else {
        setSipAccountAvailable(result.data)
      }
    })
  }, [auth, setSipAccountAvailable])
}
