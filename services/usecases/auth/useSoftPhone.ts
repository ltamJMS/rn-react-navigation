import { useCallback, useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  clearTokenFromFirestore,
  getAgents,
  handleChangeStatus,
  saveTokenToFirestore
} from './softphone'
import { RTCSession } from 'jssip/lib/RTCSession'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'
import useLogout from './useLogout'
import { authState, sipAccountState } from '../../store/auth'
import {
  agentLoginState,
  currentCallState,
  incomingShowState
} from '../../store/softphone'
import { loginAgent, logoutAgent } from '../../agentStatus'
import {
  CallDirection,
  SendDTMFRequest,
  SoftPhoneCallInfo,
  SoftPhoneCallState
} from '../../models/softPhone'
import RNFS from 'react-native-fs'
import { useSoftPhoneContext } from '../../../SoftPhoneProvider'

export const useSoftPhone = () => {
  const sipAccountData = useRecoilValue(sipAccountState)
  const setIncomingShow = useSetRecoilState(incomingShowState)
  const [, setCurrentCall] = useRecoilState(currentCallState)
  const [agentLoginStatus, setAgentLoginStatus] =
    useRecoilState(agentLoginState)
  const logout = useLogout()
  const logFilePath = `${RNFS.DocumentDirectoryPath}/consoleLogs.log`
  const auth = useRecoilValue(authState)
  const { softPhone } = useSoftPhoneContext()

  useEffect(() => {
    console.log('🌸 softPhone -> softPhone', softPhone)
  }, [softPhone])

  const handleLogin = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    status: number
  ) => {
    setLoading(true)
    if (!softPhone || !auth) {
      setLoading(false)
      return
    }
    try {
      console.log('🌸 START LOGIN AGENT ...')
      await RNFS.unlink(logFilePath)
      softPhone.getCurrentNetwork()
      const { sipAccount, sipPassword, domain, agent } = sipAccountData
      const response = await loginAgent(
        sipAccount,
        sipPassword,
        agent.agentAccount,
        agent.agentPassword,
        domain
      )
      if (response.success) {
        const dataAgent = await getAgents(auth.customerID, auth.username)
        const isChangesStatusSuccess = await handleChangeStatus(
          status,
          auth,
          dataAgent
        )()
        const [agentData] = Object.values(dataAgent)
        const extenNumber = agentData.exten
        console.log('🌸 extenNumber', extenNumber)
        console.log('🌸 STATUS CHANGED - 待機中')
        await new Promise(resolve => setTimeout(resolve, 2000))
        if (isChangesStatusSuccess) {
          softPhone.register()
        }
        await saveTokenToFirestore(auth?.customerID, extenNumber, sipAccount)
        setAgentLoginStatus(true)
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('🔴 LOGIN ERROR', error)
      setLoading(false)
    }
  }

  const handleCall = useCallback(
    async (phoneNumber: string) => {
      try {
        if (!softPhone || !auth || !phoneNumber) return
        softPhone.register()
        await new Promise(resolve => setTimeout(resolve, 500))
        const callSession: RTCSession = await softPhone.call(phoneNumber)
        console.log('🔴 useSF -> Calling:', phoneNumber, softPhone)
        const outgoingCall: SoftPhoneCallInfo = {
          direction: CallDirection.OUTGOING,
          dst: { num: phoneNumber },
          src: { num: auth.name },
          state: SoftPhoneCallState.CALLING,
          sessionId: callSession.id,
          media: { audio: true }
        }
        console.log('🔴 useSF -> outgoingCall:', outgoingCall)

        setCurrentCall(outgoingCall)
      } catch (error) {
        console.error('🔴 CALL ERROR', error)
      }
    },
    [softPhone, auth, setCurrentCall]
  )

  const handleAnswer = useCallback(
    async (sessionId: any) => {
      console.log('🌸 HANDLE ANSWER', softPhone, sessionId)
      if (!softPhone) return
      setIncomingShow(false)
      await softPhone.answer(sessionId)
    },
    [softPhone, setIncomingShow]
  )

  const handleHold = useCallback(
    async (sessionId: any) => {
      if (!softPhone) return

      try {
        await softPhone.hold(sessionId)
      } catch (e) {
        console.log('🔴 HOLD ERROR', e)
      }
    },
    [softPhone]
  )

  const handleUnHold = useCallback(
    async (sessionId: any) => {
      if (!softPhone) return
      try {
        await softPhone.unhold(sessionId)
      } catch (e) {
        console.log('🔴 UN_HOLD ERROR', e)
      }
    },
    [softPhone]
  )

  const handleTerminate = useCallback(
    async (sessionId: any) => {
      if (!softPhone) return
      try {
        setIncomingShow(false)
        await softPhone.terminate(sessionId)
      } catch (e) {
        console.log('🔴 TERMINATE ERROR', e)
      }
    },
    [setIncomingShow, softPhone]
  )

  const handleRefer = useCallback(
    async (holdSessionId: any, currentSessionId: any) => {
      if (!softPhone) return

      try {
        await softPhone.refer(holdSessionId, currentSessionId)
      } catch (e) {
        console.log('🔴 REFER ERROR', e)
      }
    },
    [softPhone]
  )

  const handleLogout = useCallback(
    (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (!softPhone || !auth) {
        setLoading(false)
        return
      }
      const { sipAccount, domain, agent } = sipAccountData
      if (agentLoginStatus) {
        Alert.alert(
          'ログアウト',
          'エージェントもログアウトされますが、よろしいでしょうか？',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: async () => {
                setLoading(true)
                softPhone.unregister({ all: true })
                await new Promise(resolve => setTimeout(resolve, 2000))
                const resLogoutAgent = await logoutAgent(
                  sipAccount,
                  agent.agentAccount,
                  domain
                )
                const dataAgent = await getAgents(
                  auth.customerID,
                  auth.username
                )
                const [agentData] = Object.values(dataAgent)
                const extenNumber = agentData.exten
                await clearTokenFromFirestore(auth?.customerID, extenNumber)

                if (resLogoutAgent.success) {
                  Toast.show({
                    type: 'success',
                    text1: 'エージェントログアウトしました!'
                  })
                  logout()
                  setLoading(false)
                } else {
                  setLoading(false)
                  Alert.alert(
                    'Logout',
                    `ログアウトに失敗しました: ${resLogoutAgent.message}`
                  )
                }
              }
            }
          ]
        )
      } else {
        setLoading(true)
        logout()
        setLoading(false)
      }
    },
    [agentLoginStatus, auth, logout, sipAccountData, softPhone]
  )

  const handleRegisterSip = useCallback(async () => {
    if (!softPhone) return
    softPhone.register()

    await new Promise(resolve => setTimeout(resolve, 1000))
  }, [softPhone])

  //handleQuitSoftphone, useLogoutAgent.tsx
  const handleUnregisterSip = useCallback(() => {
    console.log('Request to unregister softphone')
    if (!softPhone) return
    softPhone.unregister({ all: true })
  }, [softPhone])

  const handleSendDTMF = useCallback(
    (data: SendDTMFRequest) => {
      if (!auth || !softPhone) return
      const { tone, sessionId } = data
      softPhone.sendDTMF(tone, sessionId, (success: boolean) => {
        if (success) {
          // playDTMFTone()
          console.log('🌸 DTMF TONE: ', tone)
        }
      })
    },
    [auth, softPhone]
  )

  return {
    handleLogin,
    handleCall,
    handleTerminate,
    handleHold,
    handleUnHold,
    handleRefer,
    handleAnswer,
    handleLogout,
    handleRegisterSip,
    handleUnregisterSip,
    handleSendDTMF
  }
}
