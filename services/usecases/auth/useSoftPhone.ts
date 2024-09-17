import { useCallback, useEffect, useMemo } from 'react'
import { InfinitalkSIP, SipConfig } from './InfinitalkSIP'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  getIncomingUserInfoByRTCSessionEvent,
  handleChangeStatus,
  saveTokenToFirestore
} from './softphone'
import { RTCSession } from 'jssip/lib/RTCSession'
import { IncomingRTCSessionEvent } from 'jssip/lib/UA'
import { authState, sipAccountState } from '../../store/auth'
import {
  agentLoginState,
  currentCallState,
  holdingCallState,
  incomingShowState
} from '../../store/softphone'
import { loginAgent } from '../../agentStatus'
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
  useEffect(() => {
    if (!currentCall) return
    console.log('=====> CURRENT CALL: ', currentCall)
  }, [currentCall])

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

  useEffect(() => {
    if (!softPhone) return
    const sessionMap = softPhone?.getCallSessionMap()
    console.log('=====> SESSION MAP: ', sessionMap)
  }, [softPhone])

  const handleLogin = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setLoadingText: React.Dispatch<React.SetStateAction<string>>,
    fcmToken: any
  ) => {
    setLoading(true)
    if (!softPhone) {
      setLoading(false)
      return
    }
    try {
      softPhone.register()
      const { sipAccount, sipPassword, domain, agent } = sipAccountData
      const response = await loginAgent(
        sipAccount,
        sipPassword,
        agent.agentAccount,
        agent.agentPassword,
        domain
      )
      if (response.success) {
        const status = 0
        await handleChangeStatus(status, auth, setLoadingText)()
        await saveTokenToFirestore(
          auth?.customerID || '951a',
          sipAccount,
          fcmToken
        )
        setAgentLoginStatus(true)
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error', error)
      setLoading(false)
    }
  }

  const handleCall = useCallback(
    async (phoneNumber: string) => {
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
    },
    [softPhone, auth, setCurrentCall]
  )

  const handleAnswer = useCallback(
    async (sessionId: any) => {
      if (!softPhone) return
      console.log('Answer the call')
      setIncomingShow(false)
      await softPhone.answer(sessionId)
    },
    [softPhone, setIncomingShow]
  )

  const handleHold = useCallback(
    async (sessionId: any) => {
      console.log('Request to hold sessionId:', sessionId)

      if (!softPhone) return

      try {
        await softPhone.hold(sessionId)
      } catch (e) {
        console.log('hold failed', e)
      }
    },
    [softPhone]
  )

  const handleUnHold = useCallback(
    async (sessionId: any) => {
      console.log('Request to unhold sessionId: ', sessionId)
      if (!softPhone) return
      try {
        await softPhone.unhold(sessionId)
      } catch (e) {
        console.log('unhold fail.', e)
      }
    },
    [softPhone]
  )

  const handleTerminate = useCallback(
    async (sessionId: any) => {
      console.log('Request to terminate sessionId: ', sessionId)
      if (!softPhone) return
      try {
        await softPhone.terminate(sessionId)
      } catch (e) {
        console.log('terminate fail', e)
      }
    },
    [softPhone]
  )

  const handleRefer = useCallback(
    async (holdSessionId: any, currentSessionId: any) => {
      console.log(
        `Request to refer. current session ${currentSessionId}. hold session ${holdSessionId}`
      )
      if (!softPhone) return

      try {
        await softPhone.refer(holdSessionId, currentSessionId)
      } catch (e) {
        console.log('refer fail', e)
      }
    },
    [softPhone]
  )

  useEffect(() => {
    console.log('=====> useEffect listen call', softPhone)

    if (!softPhone || !auth) return
    const { eventSFEmitter } = softPhone
    eventSFEmitter.on('listenCall', (payload: CallEventEmitterPayload<any>) => {
      const { event, sessionId, data } = payload
      let currSession
      let holdSession
      // let errCode: number | undefined;
      // let errmessage: string | undefined;
      // let callTime: string;

      switch (event) {
        case 'progress': {
          if (!softPhone.isSessionExisted(sessionId)) return
          setCurrentCall((currVal: SoftPhoneCallInfo | undefined) => {
            if (!currVal) return
            return { ...currVal, state: SoftPhoneCallState.WAITING }
          })

          break
        }
        case 'confirmed': {
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
          // TODO
          break
        }
        case 'ended':
        case 'failed': {
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
          if (!softPhone.isSessionExisted(sessionId)) return
          setHoldingCall(currentCall)
          setCurrentCall(undefined)
          break
        case 'unhold':
          if (!softPhone.isSessionExisted(sessionId)) return
          setCurrentCall(holdingCall)
          setHoldingCall(undefined)
          break
        case 'refer':
          if (!softPhone.isSessionExisted(sessionId)) return
          // handle when receive a refer from another call
          break
        case 'send-refer-success':
          if (!softPhone.isSessionExisted(sessionId)) return
          setHoldingCall(undefined)
          setCurrentCall(undefined)
          break
        case 'send-refer-failed':
          if (!softPhone.isSessionExisted(sessionId)) return
          // handle when send a refer fail
          break
        case 'getusermediafailed':
          if (!softPhone.isSessionExisted(sessionId)) return
          break
        default:
          break
      }
    })

    return () => {
      softPhone.eventSFEmitter.removeAllListeners('listenCall')
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
    handleAnswer
  }
}
