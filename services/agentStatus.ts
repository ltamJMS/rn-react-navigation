import axios from 'axios'
import qs from 'qs'
import configs from './configs'
import firebase from '@react-native-firebase/app'
import AgentStatus, {
  AgentStatusMap,
  AgentType,
  StatusConfig
} from './models/softPhone'
import { FirestoreListenHandler, UnsubscribeListen } from './models/Firebase'
import { Response } from './models/Response'
import Tenant from './models/Tenant'
import { MD3Colors } from 'react-native-paper'

const { apiGatewayDomain } = configs
const axiosWithoutToken = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

class HTTPError extends Error {
  private code: number

  constructor(error: any) {
    super(error.message)
    this.code = error.response ? error.response.status : 500
    this.name = 'HTTPError'
  }

  getCode(): number {
    return this.code
  }

  getMessage(): string {
    return this.message
  }
}

// add new code

export const createAgentStatus = (data: any): AgentStatus | null => {
  if (typeof data.status !== 'number') {
    return null
  }

  const as: AgentStatus = {
    name: data.name as string,
    userID: data.userID as number,
    username: data.username as string,
    groupNames: data.groupNames as string[],
    contextName: data.contextName as string,
    status: data.status < 200 ? data.status : data.status - 200,
    phoneStatus: data.phoneStatus as number,
    sipAccount: data.sipAccount as string,
    type: data.type === 1 ? AgentType.NORMAL : AgentType.MANAGER,
    interface: data.interface as string,
    exten: data.exten as string,
    contextPrefix: data.contextPrefix as number
  }

  if (data.raiseHandAt) {
    as.raiseHandAt = new Date(data.raiseHandAt.seconds * 1000)
  }

  return as
}

export const listenAgentStatuses = (
  customerID: string,
  handler: FirestoreListenHandler<AgentStatus>
): UnsubscribeListen => {
  const db = firebase.firestore()
  const asCollection = db
    .collection('customers')
    .doc(customerID)
    .collection('agentStatuses')
  const unsubscribe = asCollection
    .orderBy('sipAccount')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data()
        const as = createAgentStatus(data)

        if (as) {
          if (change.type === 'added' && handler.onAdded) {
            // agentStatusEmitter.emit('data', 'added', as);
            handler.onAdded(as)
          } else if (change.type === 'modified' && handler.onModified) {
            // agentStatusEmitter.emit('data', 'modified', as);
            handler.onModified(as)
          } else if (change.type === 'removed' && handler.onRemoved) {
            // agentStatusEmitter.emit('data', 'removed', as);
            handler.onRemoved(as)
          }
        } else {
          // 'as' is null when data on firestore not contain status.
          // It mean agent status info doesn't updated yet or this user isn't a tenant.
          if (change.type !== 'added' && handler.onRemoved) {
            // agentStatusEmitter.emit('data', 'removed', { userID: data.userID });
            handler.onRemoved({ userID: data.userID })
          }
        }
      })
    })

  return () => {
    unsubscribe()
  }
}

export const getAgents = async (
  customerId: string
): Promise<AgentStatusMap> => {
  const data: AgentStatusMap = {}

  try {
    const db = firebase.firestore()
    const agentRef = await db
      .collection('customers')
      .doc(customerId)
      .collection('agentStatuses')
      .get()

    agentRef.docs.forEach(doc => {
      const agent = createAgentStatus(doc.data())
      if (agent) {
        data[agent.userID] = agent
      }
    })
  } catch (error) {
    return data
  }

  return data
}

export const listenFixedAgentStatuses = (props: {
  customerId: string
  usernames: string[]
  handler: FirestoreListenHandler<AgentStatus>
}): UnsubscribeListen => {
  const { customerId, usernames, handler } = props
  const db = firebase.firestore()
  const asCollection = db
    .collection('customers')
    .doc(customerId)
    .collection('agentStatuses')
  const unsubscribe = asCollection
    .where('username', 'in', usernames)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data()
        const as = createAgentStatus(data)

        if (as) {
          if (change.type === 'added' && handler.onAdded) {
            handler.onAdded(as)
          } else if (change.type === 'modified' && handler.onModified) {
            handler.onModified(as)
          } else if (change.type === 'removed' && handler.onRemoved) {
            handler.onRemoved(as)
          }
        } else {
          if (change.type !== 'added' && handler.onRemoved) {
            handler.onRemoved({ userID: data.userID })
          }
        }
      })
    })

  return () => {
    unsubscribe()
  }
}

export const listenAgentStatus = (
  customerID: string,
  condition: Partial<AgentStatus>,
  handler: FirestoreListenHandler<AgentStatus>
): UnsubscribeListen => {
  const db = firebase.firestore()
  const asCollection = db
    .collection('customers')
    .doc(customerID)
    .collection('agentStatuses')
  const unsubscribe = asCollection
    .where('username', '==', condition.username)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data()
        const as = createAgentStatus(data)

        if (as) {
          if (change.type === 'added' && handler.onAdded) {
            handler.onAdded(as)
          } else if (change.type === 'modified' && handler.onModified) {
            handler.onModified(as)
          } else if (change.type === 'removed' && handler.onRemoved) {
            handler.onRemoved(as)
          }
        } else {
          // 'as' is null when data on firestore not contain status.
          // It mean agent status info doesn't updated yet or this user isn't a tenant.
          if (change.type !== 'added' && handler.onRemoved) {
            handler.onRemoved({ userID: data.userID })
          }
        }
      })
    })

  return () => {
    unsubscribe()
  }
}

// end

export const changeAgentStatus = async (
  customerId: string,
  queue: string,
  asInterface: string,
  paused: string,
  reason?: string
): Promise<any> => {
  const uri = `https://api.infinitalk.net/api/v1/ami/agent/status?serverNumber=${customerId.slice(
    0,
    3
  )}`
  try {
    const data = {
      Action: 'QueuePause',
      Queue: queue,
      Interface: asInterface,
      Paused: paused,
      Reason: reason
    }

    await axios.post(uri, data, { timeout: 60000 })

    return {
      success: true,
      message: 'SUCCESS'
    }
  } catch (err: any) {
    console.error('🔴 CHANGE STATUS ERROR', err)
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401)
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    return {
      success: false,
      message: 'FAILED',
      error: { ...httpError, message: messageErr }
    }
  }
}

export const checkAgentLogin = async (
  sipaccount: string,
  sippassword: string,
  account: string,
  password: string,
  domain: string
): Promise<Response<{ forcedLogout: boolean }>> => {
  const domainFull = `https://${domain}`
  const url = `${configs.apiGatewayDomain}/infinitalk/agentstatus/logincheck?domain=${domainFull}`

  try {
    const data = qs.stringify({
      sipaccount,
      sippassword,
      account,
      password
    })

    const checkAgentLoginRes = await axios.post(url, data, { timeout: 60000 })

    // check if agent is logged in on another pc, then forced logout this agent
    if (
      checkAgentLoginRes.data.error === undefined ||
      checkAgentLoginRes.data.user_id !== undefined
    ) {
      // agent is logged in on another pc
      await logoutAgent(sipaccount, account, domain)

      const asteriskDatabaseUpdateTimout = 5000
      await new Promise(resolve =>
        setTimeout(resolve, asteriskDatabaseUpdateTimout)
      )

      return {
        success: true,
        data: { forcedLogout: true }
      }
    }

    return {
      success: true,
      data: { forcedLogout: false }
    }
  } catch (err: any) {
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401)
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    return {
      success: false,
      message: messageErr
    }
  }
}

export const loginAgent = async (
  sipaccount: string,
  sippassword: string,
  account: string,
  password: string,
  domain: string
): Promise<any> => {
  const domainFull = `https://${domain}`
  const url = `https://api.infinitalk.net/infinitalk/agentstatus/login?domain=${domainFull}`

  try {
    // login agent
    const data = qs.stringify({
      sipaccount,
      sippassword,
      account,
      password,
      webrtcflg: 1
    })

    const res = await axios.post(url, data, { timeout: 60000 })

    if (res.data.error) {
      return { success: false, message: `${res.data.error}` }
    }

    // will need to wait a few seconds after successful agent login
    const asteriskDatabaseUpdateTimout = 5000
    await new Promise(resolve =>
      setTimeout(resolve, asteriskDatabaseUpdateTimout)
    )
    return {
      success: true
    }
  } catch (err: any) {
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401) {
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    }
    return {
      success: false,
      message: messageErr,
      error: { ...httpError, message: messageErr }
    }
  }
}

export const checkAgentLoginByPrivateIP = async (
  sipaccount: string,
  sippassword: string,
  account: string,
  password: string,
  domain: string
): Promise<Response<{ forcedLogout: boolean }>> => {
  const url = `http://${domain}/infinitalk/agentstatus/logincheck`
  try {
    const data = qs.stringify({
      sipaccount,
      sippassword,
      account,
      password
    })

    const checkAgentLoginRes = await axiosWithoutToken.post(url, data, {
      timeout: 60000
    })

    // check if agent is logged in on another pc, then forced logout this agent
    if (
      checkAgentLoginRes.data.error === undefined ||
      checkAgentLoginRes.data.user_id !== undefined
    ) {
      // agent is logged in on another pc
      await logoutAgent(sipaccount, account, domain)

      const asteriskDatabaseUpdateTimout = 5000
      await new Promise(resolve =>
        setTimeout(resolve, asteriskDatabaseUpdateTimout)
      )

      return {
        success: true,
        data: { forcedLogout: true }
      }
    }

    return {
      success: true,
      data: { forcedLogout: false }
    }
  } catch (err: any) {
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401)
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    return {
      success: false,
      message: messageErr
    }
  }
}

export const loginAgentByPrivateIP = async (
  sipaccount: string,
  sippassword: string,
  account: string,
  password: string,
  domain: string
): Promise<any> => {
  const url = `http://${domain}/infinitalk/agentstatus/login`
  try {
    // login agent
    const data = qs.stringify({
      sipaccount,
      sippassword,
      account,
      password,
      webrtcflg: 1
    })
    const res = await axiosWithoutToken.post(url, data, { timeout: 60000 })

    if (res.data.error) {
      return { success: false, message: `${res.data.error}` }
    }

    // will need to wait a few seconds after successful agent login
    const asteriskDatabaseUpdateTimout = 5000
    await new Promise((resolve: any) =>
      setTimeout(resolve, asteriskDatabaseUpdateTimout)
    )

    return {
      success: true
    }
  } catch (err: any) {
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401) {
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    }
    return {
      success: false,
      message: messageErr,
      error: { ...httpError, message: messageErr }
    }
  }
}

export const logoutAgent = async (
  sipaccount: string,
  account: string,
  domain: string
): Promise<any> => {
  const domainFull = `https://${domain}`
  const url = `${apiGatewayDomain}/infinitalk/agentstatus/logout?domain=${domainFull}`

  try {
    const data = qs.stringify({
      sipaccount,
      account
    })

    await axios.post(url, data, { timeout: 10000 })

    return {
      success: true
    }
  } catch (err: any) {
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401)
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    return {
      success: false,
      message: 'FAILED',
      error: { ...httpError, message: messageErr }
    }
  }
}

export const logoutAgentByPrivateIP = async (
  sipaccount: string,
  account: string,
  domain: string
): Promise<Response> => {
  const url = `http://${domain}/infinitalk/agentstatus/logout`

  try {
    const data = qs.stringify({
      sipaccount,
      account
    })

    await axiosWithoutToken.post(url, data, { timeout: 10000 })

    return {
      success: true
    }
  } catch (err: any) {
    const httpError = new HTTPError(err)
    let messageErr = httpError.getMessage()
    if (httpError.getCode() === 401)
      messageErr =
        'セッションがタイムアウトしました。再度サインインしてください'
    return {
      success: false,
      message: messageErr
    }
  }
}

export const getDisplayStatus = (
  phoneStatus: number,
  status: number
): number => {
  if (phoneStatus > 0) {
    return phoneStatus
  } else if (status >= 200) {
    return status - 200
  }

  return status
}

export const getStatusStyle = (dispStatus: number) => {
  switch (dispStatus) {
    case 0:
      return { color: '#03c2fc', icon: 'headset' }
    case 1:
      return { color: '#8c8c8c', icon: 'power' }
    case 78:
    case 88:
    case 98:
    case 79:
    case 89:
    case 99:
      return { color: '#00c241', icon: 'call' }
    case 2:
    case 3:
    default:
      return { color: '#ff7af8', icon: 'hammer' }
  }
}

export const getASText = (
  phoneStatus: number,
  status: number,
  tenant: Tenant
): string => {
  const { agentStatusText } = tenant
  const dispStatus = getDisplayStatus(phoneStatus, status)
  const statusText = agentStatusText[dispStatus]
  return statusText || ''
}
