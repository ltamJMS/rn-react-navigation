import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect
} from 'react'
import {
  InfinitalkSIP,
  SipConfig
} from './services/usecases/auth/InfinitalkSIP'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { authState } from './services/store/auth'
import {
  callRequestState,
  currentCallState,
  holdingCallState,
  incomingRequestState,
  incomingShowState
} from './services/store/softphone'
import {
  CallDirection,
  CallEventEmitterPayload,
  SoftPhoneCallInfo,
  SoftPhoneCallState
} from './services/models/softPhone'
import { getIncomingUserInfoByRTCSessionEvent } from './services/usecases/auth/softphone'
import { IncomingRTCSessionEvent } from 'jssip/lib/UA'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from './shared/constants'

interface SoftPhoneProviderProps {
  children: ReactNode
}

interface SoftPhoneContextType {
  softPhone: InfinitalkSIP | null
  setupSoftPhone: (sipConfig: SipConfig) => void
}

const SoftPhoneContext = createContext<SoftPhoneContextType | undefined>(
  undefined
)

export const SoftPhoneProvider: React.FC<SoftPhoneProviderProps> = ({
  children
}) => {
  const [softPhone, setSoftPhone] = useState<InfinitalkSIP | null>(null)
  const [currentCall, setCurrentCall] = useRecoilState(currentCallState)
  const [holdingCall, setHoldingCall] = useRecoilState(holdingCallState)
  const setIncomingShow = useSetRecoilState(incomingShowState)
  const [auth] = useRecoilState(authState)
  const [, setIncomingRequest] = useRecoilState(incomingRequestState)
  const [, setCallRequest] = useRecoilState(callRequestState)

  const setupSoftPhone = (sipConfig: SipConfig) => {
    const newSoftPhone = new InfinitalkSIP(sipConfig, {
      listenCall: true,
      listenUA: true
    })
    setSoftPhone(newSoftPhone)
  }

  const value = useMemo(() => ({ softPhone, setupSoftPhone }), [softPhone])

  useEffect(() => {
    if (!softPhone || !auth) return

    const handleCallEvent = (payload: CallEventEmitterPayload<any>) => {
      const { event, sessionId, data } = payload
      let currSession
      let holdSession

      switch (event) {
        case 'progress': {
          console.log('🌸 HANDLE EVENT - progress')
          if (!softPhone.isSessionExisted(sessionId)) return
          setCurrentCall((currVal: SoftPhoneCallInfo | undefined) => {
            if (!currVal) return
            return { ...currVal, state: SoftPhoneCallState.WAITING }
          })

          break
        }
        case 'confirmed': {
          console.log('🌸 HANDLE EVENT - confirmed')

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
          console.log('🌸 HANDLE EVENT - accepted')
          // TODO
          break
        }
        case 'ended':
        case 'failed': {
          console.log('🌸 HANDLE EVENT - ended or failed')

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
          setCallRequest({
            isOutbound: false,
            phoneNumber: ''
          })
          setIncomingRequest({
            isIncomingCall: false,
            incomingUserInfo: {}
          })
          break
        }
        case 'incoming': {
          console.log('🌸 HANDLE EVENT - incoming')
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
          console.log('🌸 incomingUserInfo', incomingUserInfo)
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
          console.log('🌸 incomingCall', incomingCall)
          setCurrentCall(incomingCall)
          const sessionDataMap = softPhone?.getCallSessionMap()
          console.log('00000 sessionDataMap', sessionDataMap)
          if (!currentCall) {
            setIncomingRequest((currVal: any) => ({
              ...currVal,
              isIncomingCall: true,
              incomingUserInfo
            }))
            NavigationService.push(SCREENS.CALL_SCREEN)
          }
          break
        }
        case 'custom':
          console.log('🌸 HANDLE EVENT - custom')
          if (!softPhone) return
          softPhone?.answer(sessionId)
          break
        case 'hold':
          console.log('🌸 HANDLE EVENT - hold')
          if (!softPhone.isSessionExisted(sessionId)) return
          setHoldingCall(currentCall)
          setCurrentCall(undefined)
          break
        case 'unhold':
          console.log('🌸 HANDLE EVENT - unhold')
          if (!softPhone.isSessionExisted(sessionId)) return
          setCurrentCall(holdingCall)
          setHoldingCall(undefined)
          break
        case 'refer':
          console.log('🌸 HANDLE EVENT - refer')
          if (!softPhone.isSessionExisted(sessionId)) return
          // handle when receive a refer from another call
          break
        case 'send-refer-success':
          console.log('🌸 HANDLE EVENT - send-refer-success')
          if (!softPhone.isSessionExisted(sessionId)) return
          setHoldingCall(undefined)
          setCurrentCall(undefined)
          setCallRequest({
            isOutbound: false,
            phoneNumber: ''
          })
          setIncomingRequest({
            isIncomingCall: false,
            incomingUserInfo: {}
          })
          break

        case 'send-refer-failed':
          console.log('🌸 HANDLE EVENT - send-refer-failed')
          if (!softPhone.isSessionExisted(sessionId)) return
          // handle when send a refer fail
          break
        case 'getusermediafailed':
          console.log('🌸 HANDLE EVENT - getusermediafailed')
          if (!softPhone.isSessionExisted(sessionId)) return
          break
        default:
          break
      }
    }

    const { eventSFEmitter } = softPhone
    eventSFEmitter.on('listenCall', handleCallEvent)

    return () => {
      eventSFEmitter.removeListener('listenCall', handleCallEvent)
    }
  }, [
    softPhone,
    auth,
    setCurrentCall,
    setHoldingCall,
    setIncomingShow,
    setIncomingRequest,
    currentCall,
    holdingCall,
    setCallRequest
  ])

  return (
    <SoftPhoneContext.Provider value={value}>
      {children}
    </SoftPhoneContext.Provider>
  )
}

export const useSoftPhoneContext = (): SoftPhoneContextType => {
  const context = useContext(SoftPhoneContext)
  if (!context) {
    throw new Error(
      'useSoftPhoneContext must be used within a SoftPhoneProvider'
    )
  }
  return context
}
