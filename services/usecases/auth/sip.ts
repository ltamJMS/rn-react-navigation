import EventEmitter from 'events'
// import { RTCPeerConnectionDeprecated } from "jssip/lib/RTCSession";

const timeoutIds: Record<string, NodeJS.Timeout> = {}

export const connectionStateMessageEmitter = new EventEmitter()

export const onconnectionstatechange = (
  terminateCallback: (sessionId: string) => Promise<boolean>,
  sessionId: string,
  sessionConnection: any
) => {
  return () => {
    const currentState = sessionConnection.connectionState
    console.log('⚠️ Connection state changed, new state:', currentState)

    switch (currentState) {
      case 'connected':
        clearTimeout(timeoutIds[sessionId])
        break
      case 'disconnected':
      case 'closed':
      case 'failed':
        timeoutIds[sessionId] = setTimeout(() => {
          console.log(
            `💀 Session ${sessionId} terminated. Reason: connection ${currentState}`
          )

          connectionStateMessageEmitter.emit('rtp-error')

          terminateCallback(sessionId)
        }, 10000)
    }
  }
}
