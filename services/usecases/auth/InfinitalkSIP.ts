import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription
} from 'react-native-webrtc-web-shim'
import JsSIP, { UA } from 'jssip'
import {
  EndEvent,
  HoldEvent,
  IncomingEvent,
  OutgoingEvent,
  ReferEvent,
  ReferOptions,
  RTCSession
} from 'jssip/lib/RTCSession'

import {
  IncomingRTCSessionEvent,
  UnRegisteredEvent,
  UnRegisterOptions
} from 'jssip/lib/UA'
import EventEmitter from 'events'

import { DTMF_TRANSPORT } from 'jssip/lib/Constants'
import {
  CallEventEmitterPayload,
  CallSessionMap,
  InfinitalkCallConfig,
  UAEventEmitterPayload
} from '../../models/softPhone'
import { onconnectionstatechange } from './sip'

// Define global variables
declare var global: {
  RTCPeerConnection: any
  RTCSessionDescription: any
  navigator: {
    mediaDevices: any
  }
}

// Assign global variables
global.RTCPeerConnection = RTCPeerConnection
global.RTCSessionDescription = RTCSessionDescription
global.navigator = {
  mediaDevices: mediaDevices
}

export interface InfinitalkSIPConfig {
  uaOptions?: any
  listenCall?: boolean
  listenUA?: boolean
}

export interface SipConfig {
  account: string
  password: string
  domain: string
  port: number
}

export interface CallSession {
  session: RTCSession
  type: CallSessionType
  removeListener?: () => void
}

export enum CallSessionType {
  CURRENT = 'current',
  HOLD = 'hold',
  INCOMING_WAITING = 'incoming_waiting'
}

export interface InfinitalkSipInterface {
  config: InfinitalkSIPConfig
  sip: SipConfig
  ua: UA
  callSessionMap: CallSessionMap
  eventSFEmitter: NodeJS.EventEmitter

  getCurrentSession(): RTCSession | undefined
  getHoldSession(): RTCSession | undefined
  getIncomingWaitingSession(): RTCSession | undefined
  getSessionData(sessionId: string): CallSession | undefined
  getCallSessionMap: () => CallSessionMap

  setCurrentSession(session: RTCSession): void
  setCurrentSessionById(sessionId: string): void
  setHoldSession(sessionId: string): void
  setCallSession(data: CallSession): void

  register(): void
  unregister(options?: UnRegisterOptions): void

  call(
    phoneNumber: string,
    callOptions?: any,
    configs?: InfinitalkCallConfig,
    dataBF?: any,
    scenarioMode?: boolean,
    endCallMode?: boolean
  ): Promise<RTCSession>
  listenCall(sessionId: string): () => void
  answer(sessionId: string, options?: any): Promise<void>
  terminate(sessionId: string): Promise<boolean>
  hold(sessionId: string): Promise<boolean>
  unhold(sessionId: string): Promise<boolean>
  sendDTMF(
    tone: string,
    sessionId: string,
    listener: (success: boolean) => void
  ): void
  refer(
    holdSessionId: string,
    currentSessionId: string,
    eventHandlers?: any
  ): Promise<boolean>
  setMute(muted: boolean, sessionId: string, options?: any): Promise<boolean>
  isSessionExisted(sessionId: string): boolean
  listenToConnectionStateChange(session: RTCSession): void
}

export class InfinitalkSIP implements InfinitalkSipInterface {
  sip: SipConfig
  config: InfinitalkSIPConfig
  ua: UA
  eventSFEmitter: NodeJS.EventEmitter
  callSessionMap: Record<string, CallSession> = {}

  constructor(sip: SipConfig, config?: InfinitalkSIPConfig) {
    this.config = config || { listenCall: false, listenUA: false }
    this.sip = sip
    this.eventSFEmitter = new EventEmitter()
    const { account, password, domain, port } = this.sip
    const url = `wss://${domain}:${port}/ws`
    const socket = new JsSIP.WebSocketInterface(url)
    const uaOptionBase = {
      sockets: [socket],
      uri: `sip:${account}@${domain}`,
      password,
      register: true,
      contact_uri: `sip:${account}@${domain};transport=ws`,
      session_timers: false,
      user_agent: 'InfiniTalk ClientApp Ver1.23.0'
    }
    this.ua = new UA({ ...uaOptionBase, ...this.config.uaOptions })

    // Init event listen ua
    if (this.config.listenUA) {
      this.listenUA()
    }
  }

  register() {
    this.ua.start()
  }

  unregister(options?: any) {
    this.ua.unregister(options)
    this.ua.stop()
  }

  async call(phoneNumber: string, callOptions?: any): Promise<RTCSession> {
    try {
      const options = {
        mediaConstraints: { audio: true, video: false }
      }
      const target = `sip:${phoneNumber}@${this.sip.domain}`

      const resSession: RTCSession = this.ua.call(target, options)

      // add session to map
      this.callSessionMap[resSession.id] = {
        session: resSession,
        type: CallSessionType.CURRENT
      }

      // listen event
      if (this.config.listenCall) {
        const removeListener = this.listenCall(resSession.id)
        this.callSessionMap[resSession.id].removeListener = removeListener
      }

      return resSession
    } catch (error) {
      console.error('Call error', error)
      throw error
    }
  }

  getCurrentSession(): RTCSession | undefined {
    const data = Object.values(this.callSessionMap).find(
      s => s.type === CallSessionType.CURRENT
    )
    if (data) return data.session
    return
  }

  getCallSessionMap(): CallSessionMap {
    return this.callSessionMap
  }

  getHoldSession(): RTCSession | undefined {
    const data = Object.values(this.callSessionMap).find(
      s => s.type === CallSessionType.HOLD
    )
    if (data) return data.session
    return
  }

  getIncomingWaitingSession(): RTCSession | undefined {
    const result = Object.values(this.callSessionMap).find(
      s => s.type === CallSessionType.INCOMING_WAITING
    )

    if (!result) return

    return result.session
  }

  getSessionData(sessionId: string) {
    const sessionData = this.callSessionMap[sessionId]
    return sessionData
  }

  setCurrentSession(session: RTCSession) {
    this.callSessionMap[session.id] = {
      session,
      type: CallSessionType.CURRENT
    }
  }

  setCurrentSessionById(sessionId: string) {
    const sessionData = this.callSessionMap[sessionId]
    if (sessionData) {
      this.callSessionMap[sessionId] = {
        ...sessionData,
        type: CallSessionType.CURRENT
      }
    }
  }

  setCallSession(data: CallSession) {
    this.callSessionMap[data.session.id] = data
  }

  setHoldSession(sessionId: string) {
    const findSession = this.callSessionMap[sessionId]

    if (findSession) {
      this.callSessionMap[sessionId] = {
        ...findSession,
        type: CallSessionType.HOLD
      }
    }
  }

  async answer(sessionId: string) {
    const sessionData = this.callSessionMap[sessionId]

    if (sessionData) {
      this.setCurrentSession(sessionData.session)
      sessionData.session.answer({
        mediaConstraints: { audio: true, video: false }
      })
    }
  }

  terminate(sessionId: string): Promise<boolean> {
    const sessionData = this.callSessionMap[sessionId]

    return new Promise((resolve, reject) => {
      if (sessionData) {
        console.log('terminate session on status:', sessionData.session.status)
        const JSSIP_TERMINATED_CODE = 8
        if (sessionData.session.status !== JSSIP_TERMINATED_CODE) {
          sessionData.session.terminate()
        }
        this.clearSession(sessionId)
        resolve(true)
      } else {
        reject(false)
      }
    })
  }

  // TODO
  clearSession(callSessionId: string) {
    console.log('clear session')

    // TODO

    // if (this.closeTrack) {
    //   this.closeTrack();
    //   this.closeTrack = undefined;
    // }
    if (this.callSessionMap[callSessionId]) {
      const { removeListener } = this.callSessionMap[callSessionId]
      if (removeListener) removeListener()
      delete this.callSessionMap[callSessionId]
    }
  }

  hold(sessionId: string): Promise<boolean> {
    const sessionData = this.callSessionMap[sessionId]

    return new Promise((resolve, reject) => {
      try {
        const JSSIP_TERMINATED_CODE = 8
        if (
          sessionData &&
          sessionData.session.status !== JSSIP_TERMINATED_CODE
        ) {
          sessionData.session.hold()
          this.setHoldSession(sessionId)
          resolve(true)
        } else {
          reject(false)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  unhold(sessionId: string): Promise<boolean> {
    const sessionData = this.callSessionMap[sessionId]

    return new Promise((resolve, reject) => {
      try {
        const JSSIP_TERMINATED_CODE = 8

        // if current session exist then do not unhold
        if (this.getCurrentSession()) resolve(false)

        if (
          sessionData &&
          sessionData.session.status !== JSSIP_TERMINATED_CODE
        ) {
          sessionData.session.unhold()
          this.setCurrentSessionById(sessionId)
          resolve(true)
        } else {
          reject(false)
        }
      } catch (e) {
        console.log(e)
        reject(false)
      }
    })
  }

  sendDTMF(
    tone: string,
    sessionId: string,
    listener: (success: boolean) => void
  ): void {
    const rtcSession: RTCSession = this.callSessionMap[sessionId].session

    if (rtcSession) {
      try {
        rtcSession.sendDTMF(tone, {
          duration: 200,
          transportType: DTMF_TRANSPORT.RFC2833
        })
        listener(true)
      } catch (error) {
        listener(false)
        console.log('Send dtmf failed.', error)
      }
    }
  }

  refer(holdSessionId: string, currentSessionId: string): Promise<boolean> {
    const holdSession = this.callSessionMap[holdSessionId]
    const currentSession = this.callSessionMap[currentSessionId]

    const options: ReferOptions = {
      replaces: currentSession.session,
      eventHandlers: {
        accepted: (data: IncomingEvent | OutgoingEvent) => {
          console.log(
            `session refer on accepted. from session ${holdSessionId} refer to session ${currentSessionId}`,
            data
          )
          const payload: CallEventEmitterPayload<
            IncomingEvent | OutgoingEvent
          > = {
            event: 'send-refer-success',
            sessionId: currentSessionId,
            data
          }
          this.terminate(holdSessionId)
          this.eventSFEmitter.emit('listenCall', payload)
        },
        failed: (data: EndEvent) => {
          console.log(
            `session refer on failed. from session ${holdSessionId} refer to session ${currentSessionId}`,
            data
          )
          const payload: CallEventEmitterPayload<EndEvent> = {
            event: 'send-refer-failed',
            sessionId: currentSessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        }
      }
    }
    return new Promise((resolve, reject) => {
      try {
        if (currentSession && holdSession) {
          holdSession.session.refer(
            currentSession.session.remote_identity.uri,
            options
          )
          resolve(true)
        } else {
          reject(false)
        }
      } catch (e) {
        console.log(e)
        reject(false)
      }
    })
  }

  setMute(muted: boolean, sessionId: string, options?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sessionData = this.callSessionMap[sessionId]

      if (!sessionData) {
        reject(false)
        return
      } else {
        if (muted) {
          sessionData.session.mute(options)
        } else {
          sessionData.session.unmute(options)
        }
        resolve(true)
        return
      }
    })
  }

  isSessionExisted(sessionId: string) {
    const sessionData = this.callSessionMap[sessionId]
    if (sessionData) return true
    return false
  }

  listenUA() {
    this.ua.on('connecting', () => {
      console.log('agent is connecting')
      const payload: UAEventEmitterPayload<any> = { event: 'connecting' }
      this.eventSFEmitter.emit('listenUA', payload)
    })

    this.ua.on('registered', () => {
      console.log('agent is registered')
      const payload: UAEventEmitterPayload<any> = { event: 'registered' }
      this.eventSFEmitter.emit('listenUA', payload)
    })

    this.ua.on('registrationFailed', (data: UnRegisteredEvent) => {
      console.log('agent is registrationFailed')
      const payload: UAEventEmitterPayload<UnRegisteredEvent> = {
        event: 'registrationFailed',
        data
      }
      this.eventSFEmitter.emit('listenUA', payload)
    })

    this.ua.on('newRTCSession', (data: any) => {
      const { session } = data

      // If incoming call
      if (session.direction === 'incoming') {
        this.callSessionMap[session.id] = {
          session,
          type: CallSessionType.INCOMING_WAITING
        }

        const payload: CallEventEmitterPayload<IncomingRTCSessionEvent> = {
          event: 'incoming',
          sessionId: session.id,
          data
        }

        this.eventSFEmitter.emit('listenCall', payload)
      }
    })
  }

  listenCall(sessionId: string) {
    try {
      const sessionData = this.callSessionMap[sessionId]

      if (sessionData) {
        const { session } = sessionData
        // set call to session if not are
        if (sessionData.type !== CallSessionType.CURRENT) {
          this.callSessionMap[session.id] = {
            session,
            type: CallSessionType.CURRENT
          }
        }
        console.log(444444, session)

        session.on('progress', (data: IncomingEvent | OutgoingEvent) => {
          const payload: CallEventEmitterPayload<
            IncomingEvent | OutgoingEvent
          > = {
            event: 'progress',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('sdp', data => {
          let { sdp } = data
          const publicIp = this.getPublicIPFromSdp(sdp) || ''
          const privateIps = this.getAllPrivateIpFromCandidate(sdp)

          if (publicIp && privateIps.length > 0) {
            privateIps.forEach(privateIp => {
              const privateIpPattern = new RegExp(privateIp, 'g')
              sdp = sdp.replace(privateIpPattern, publicIp)
            })
          }
          data.sdp = sdp
        })

        session.on('confirmed', (data: IncomingEvent | OutgoingEvent) => {
          console.log('session on confirmed', sessionId)
          const payload: CallEventEmitterPayload<
            IncomingEvent | OutgoingEvent
          > = {
            event: 'confirmed',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('accepted', (data: IncomingEvent | OutgoingEvent) => {
          const payload: CallEventEmitterPayload<
            IncomingEvent | OutgoingEvent
          > = {
            event: 'accepted',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('ended', (data: EndEvent) => {
          console.log('session on ended', sessionId)
          const payload: CallEventEmitterPayload<EndEvent> = {
            event: 'ended',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)

          // TODO
          // this.removeListenerOnTerminate(session as any);
        })

        session.on('failed', (data: EndEvent) => {
          console.log('session on failed', sessionId)
          const payload: CallEventEmitterPayload<EndEvent> = {
            event: 'failed',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
          // TODO
          // this.removeListenerOnTerminate(session as any);
        })

        session.on('hold', (data: HoldEvent) => {
          console.log('session on hold', sessionId, data)
          const payload: CallEventEmitterPayload<HoldEvent> = {
            event: 'hold',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('unhold', (data: HoldEvent) => {
          console.log('session on unhold', sessionId, data)
          const payload: CallEventEmitterPayload<HoldEvent> = {
            event: 'unhold',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('refer', (data: ReferEvent) => {
          console.log('session on refer', sessionId, data)
          const payload: CallEventEmitterPayload<ReferEvent> = {
            event: 'refer',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('replaces', (data: ReferEvent) => {
          console.log('session on replaces', sessionId, data)
          const payload: CallEventEmitterPayload<ReferEvent> = {
            event: 'replaces',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        session.on('getusermediafailed', (data: any) => {
          console.log('session on getusermediafailed', sessionId, data)
          const payload: CallEventEmitterPayload<any> = {
            event: 'getusermediafailed',
            sessionId,
            data
          }
          this.eventSFEmitter.emit('listenCall', payload)
        })

        return () => {
          console.log('Remove listener for sessionId ', sessionId)
          session.removeAllListeners('progress')
          session.removeAllListeners('confirmed')
          session.removeAllListeners('ended')
          session.removeAllListeners('failed')
          session.removeAllListeners('hold')
          session.removeAllListeners('unhold')
          session.removeAllListeners('refer')
          session.removeAllListeners('replaces')
          session.removeAllListeners('getusermediafailed')
          session.removeAllListeners('peerconnection')
        }
      }

      return () => {
        console.log('Session data not exist. sessionId ', sessionId)
      }
    } catch (error) {
      console.error('Error in listenCall:', error)
      return () => {
        console.log('Error in listenCall. ', sessionId)
      }
    }
  }

  /**
   * @param sdp
   * Session Description of SDP protocol has the following format:
   * v= (protocol version)
   * o= (owner/creator and session identification)
   * s= (session name)
   * i= (session information)
   * u= (URI of description)
   * e= (email address – contact detail)
   * p= (phone number – contact detail)\
   * c= (connection information – not required if included in media description)
   * b= (session bandwidth information)
   * z= (time zone adjustments)
   * k= (encryption key)
   * a= (zero or more session attribute lines)
   *
   * This function will return originator's public ip address from o= line.
   * Details about the originator and identification of the session have format:
   * o=<username><sess-id><sess-version><nettype><addrtype><unicast-address>
   *
   * @returns public-ip
   */
  getPublicIPFromSdp(sdp: string): string | undefined {
    let ip
    const getOriginatorDetailsRegex = /o=(.*)/g
    const getAddressRegex = /IN(.*)/g
    const originatorDetailsMatch = sdp.match(getOriginatorDetailsRegex)
    if (originatorDetailsMatch) {
      // eslint-disable-next-line prefer-destructuring
      const originatorDetails = originatorDetailsMatch[0]
      const addressDetailsMatch = originatorDetails.match(getAddressRegex)
      if (addressDetailsMatch) {
        // eslint-disable-next-line prefer-destructuring
        const addressDetails = addressDetailsMatch[0]

        // example address details = "IN IP4 [public-ip]"
        // will be returned value = "public-ip"
        // eslint-disable-next-line prefer-destructuring
        ip = addressDetails.split(' ')[2]
      }
    }

    return ip
  }

  /**
   * @param sdp
   * In body of sdp, a= line has the following example format:
   * a=candidate:Ha800033 1 UDP 2130706431 10.128.0.51 11006 typ host
   * a=candidate:Ha800033 2 UDP 2130706430 10.128.0.51 11007 typ host
   * a=candidate:Ha800033 2 UDP 2130706430 10.128.0.52 11007 typ host
   *
   * This function will return private ip has was written in a= line with host type
   * @returns list private-ip ['10.128.0.51', '10.128.0.52']
   */
  getAllPrivateIpFromCandidate(sdp: string): string[] {
    // match example: "10.128.0.51 11006 typ host"
    const getPrivateIpDetailsRegex =
      /(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b\s+[0-9]+\s+typ host/g

    const ips = new Set<string>()

    const privateIpDetailsMatch = sdp.match(getPrivateIpDetailsRegex)
    if (privateIpDetailsMatch) {
      // return $0 items: "10.128.0.51"
      privateIpDetailsMatch.forEach(line => {
        // eslint-disable-next-line prefer-destructuring
        const ip: string | null = line.split(' ')[0]
        if (ip) {
          ips.add(ip)
        }
      })
    }

    return Array.from(ips)
  }

  /**
   * After receiving information about the webrtc-remote-client's connection description,
   * this function will overwrite the received, replace private ip by public ip and return new setRemoteDescription() func
   */

  listenToConnectionStateChange(session: any): void {
    session.connection.onconnectionstatechange = onconnectionstatechange(
      this.terminate.bind(this),
      session.id,
      session.connection
    )
  }
}
