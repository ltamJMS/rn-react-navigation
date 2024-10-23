import { useCallback, useEffect, useMemo } from 'react'
import { InfinitalkSIP, SipConfig } from './InfinitalkSIP'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  getAgents,
  getIncomingUserInfoByRTCSessionEvent,
  handleChangeStatus,
  saveTokenToFirestore
} from './softphone'
import { RTCSession } from 'jssip/lib/RTCSession'
import { IncomingRTCSessionEvent } from 'jssip/lib/UA'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'
import useLogout from './useLogout'
import { authState, sipAccountState } from '../../store/auth'
import {
  agentLoginState,
  currentCallState,
  holdingCallState,
  incomingShowState
} from '../../store/softphone'
import { loginAgent, logoutAgent } from '../../agentStatus'
import {
  CallDirection,
  CallEventEmitterPayload,
  SoftPhoneCallInfo,
  SoftPhoneCallState
} from '../../models/softPhone'

export const useSoftPhone = () => {
  const sipAccountData = useRecoilValue(sipAccountState)
  const setIncomingShow = useSetRecoilState(incomingShowState)
  const [currentCall, setCurrentCall] = useRecoilState(currentCallState)
  const [holdingCall, setHoldingCall] = useRecoilState(holdingCallState)
  const [agentLoginStatus, setAgentLoginStatus] =
    useRecoilState(agentLoginState)
  const logout = useLogout()

  const auth = useRecoilValue(authState)

  const softPhone = useMemo(() => {
    if (!sipAccountData) return
    const sipConfig: SipConfig = {
      account: sipAccountData.sipAccount,
      password: sipAccountData.sipPassword,
      domain: sipAccountData.domain,
      port: 8089
    }
    const softphone = new InfinitalkSIP(sipConfig, {
      listenCall: true,
      listenUA: true
    })
    return softphone
  }, [sipAccountData])

  const handleLogin = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true)
    if (!softPhone || !auth) {
      setLoading(false)
      return
    }
    try {
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
        const status = 0
        const isChangesStatusSuccess = await handleChangeStatus(
          status,
          auth,
          dataAgent
        )()
        console.log('🍀 isChangesStatusSuccess', isChangesStatusSuccess)
        await new Promise(resolve => setTimeout(resolve, 2000))
        if (isChangesStatusSuccess) {
          softPhone.register()
        }
        await saveTokenToFirestore(auth?.customerID || '951a', sipAccount)
        setAgentLoginStatus(true)
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('🔴 Login error', error)
      setLoading(false)
    }
  }

  const handleCall = useCallback(
    async (phoneNumber: string) => {
      try {
        if (!softPhone || !auth || !phoneNumber) return
        const callSession: RTCSession = await softPhone.call(phoneNumber)

        const outgoingCall: SoftPhoneCallInfo = {
          direction: CallDirection.OUTGOING,
          dst: { num: phoneNumber },
          src: { num: auth.name },
          state: SoftPhoneCallState.CALLING,
          sessionId: callSession.id,
          media: { audio: true }
        }

        setCurrentCall(outgoingCall)
      } catch (error) {
        console.error('🔴 Call error', error)
      }
    },
    [softPhone, auth, setCurrentCall]
  )

  const handleAnswer = useCallback(
    async (sessionId: any) => {
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
        console.log('🔴 hold failed', e)
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
        console.log('🔴 unhold fail.', e)
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
        console.log('🔴 terminate fail', e)
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
        console.log('🔴 refer fail', e)
      }
    },
    [softPhone]
  )

  const handleLogout = useCallback(() => {
    const { sipAccount, domain, agent } = sipAccountData
    if (!softPhone) return
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
              softPhone.unregister({ all: true })
              await new Promise(resolve => setTimeout(resolve, 2000))
              const resLogoutAgent = await logoutAgent(
                sipAccount,
                agent.agentAccount,
                domain
              )
              if (resLogoutAgent.success) {
                Toast.show({
                  type: 'success',
                  text1: 'エージェントログアウトしました!'
                })
                logout()
              } else {
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
      logout()
    }
  }, [agentLoginStatus, logout, sipAccountData, softPhone])

  useEffect(() => {
    if (!softPhone || !auth) return
    try {
      const { eventSFEmitter } = softPhone

      eventSFEmitter.on(
        'listenCall',
        (payload: CallEventEmitterPayload<any>) => {
          const { event, sessionId, data } = payload
          let currSession
          let holdSession
          // let errCode: number | undefined;
          // let errmessage: string | undefined;
          // let callTime: string;

          switch (event) {
            case 'progress': {
              console.log('🌸 handle emitter case progress')

              if (!softPhone.isSessionExisted(sessionId)) return
              setCurrentCall((currVal: SoftPhoneCallInfo | undefined) => {
                if (!currVal) return
                return { ...currVal, state: SoftPhoneCallState.WAITING }
              })

              break
            }
            case 'confirmed': {
              console.log('🌸 handle emitter case confirmed')

              if (!softPhone.isSessionExisted(sessionId)) return
              setCurrentCall((currVal: SoftPhoneCallInfo | undefined) => {
                if (!currVal) return
                return {
                  ...currVal,
                  state: SoftPhoneCallState.TALKING,
                  callConfirmTime: new Date()
                }
              })

              break
            }
            case 'accepted': {
              console.log('🌸 handle emitter case accepted')
              // TODO
              break
            }
            case 'ended':
            case 'failed': {
              console.log('🌸 handle emitter case ended/failed')

              // remove session from map
              if (!softPhone.isSessionExisted(sessionId)) return
              setIncomingShow(false)

              currSession = softPhone.getCurrentSession()
              holdSession = softPhone.getHoldSession()

              // if ended is current call then set current call to undefined
              if (currSession && currSession.id === sessionId) {
                setCurrentCall(undefined)
              }

              // if ended is holding call then set holding call to undefined
              if (holdSession && holdSession.id === sessionId) {
                setHoldingCall(undefined)
              }
              softPhone.clearSession(sessionId)

              break
            }
            case 'incoming': {
              console.log('🌸 handle emitter case incoming')
              if (!softPhone.isSessionExisted(sessionId)) return
              // TODO: if softphone busy then terminate incoming session, else listen session

              setIncomingShow(true)
              // add listener for session
              const removeListener = softPhone.listenCall(sessionId)
              const currSessionData = softPhone.getSessionData(sessionId)
              if (currSessionData) {
                softPhone.setCallSession({
                  ...currSessionData,
                  removeListener
                })
              }

              const incomingUserInfo = getIncomingUserInfoByRTCSessionEvent(
                data as IncomingRTCSessionEvent
              )

              const incomingCall = {
                direction: CallDirection.INCOMING,
                dst: { num: auth.name },
                src: {
                  num: incomingUserInfo.userName,
                  displayName: incomingUserInfo.displayName
                },
                state: SoftPhoneCallState.RECEIVING,
                sessionId,
                media: { audio: true }
              }

              setCurrentCall(incomingCall)

              break
            }
            case 'hold':
              console.log('🌸 handle emitter case hold')
              if (!softPhone.isSessionExisted(sessionId)) return
              setHoldingCall(currentCall)
              setCurrentCall(undefined)
              break
            case 'unhold':
              console.log('🌸 handle emitter case unhold')
              if (!softPhone.isSessionExisted(sessionId)) return
              setCurrentCall(holdingCall)
              setHoldingCall(undefined)
              break
            case 'refer':
              console.log('🌸 handle emitter case refer')
              if (!softPhone.isSessionExisted(sessionId)) return
              // handle when receive a refer from another call
              break
            case 'send-refer-success':
              console.log('🌸 handle emitter case send-refer-success')
              if (!softPhone.isSessionExisted(sessionId)) return
              setHoldingCall(undefined)
              setCurrentCall(undefined)
              break
            case 'send-refer-failed':
              console.log('🌸 handle emitter case send-refer-failed')
              if (!softPhone.isSessionExisted(sessionId)) return
              // handle when send a refer fail
              break
            case 'getusermediafailed':
              console.log('🌸 handle emitter case getusermediafailed')
              if (!softPhone.isSessionExisted(sessionId)) return
              break
            default:
              break
          }
        }
      )

      return () => {
        softPhone.eventSFEmitter.removeAllListeners('listenCall')
      }
    } catch (e) {
      console.log('🔴 listen call error', e)
    }
  }, [
    softPhone,
    setIncomingShow,
    auth,
    setCurrentCall,
    setHoldingCall,
    currentCall,
    holdingCall
  ])

  return {
    handleLogin,
    handleCall,
    handleTerminate,
    handleHold,
    handleUnHold,
    handleRefer,
    handleAnswer,
    handleLogout
  }
}
