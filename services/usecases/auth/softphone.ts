import { IncomingRTCSessionEvent } from 'jssip/lib/UA'
import firestore from '@react-native-firebase/firestore'
import AgentStatus, {
  AgentStatusMap,
  AgentType,
  IncomingUserInfo
} from '../../models/softPhone'
import { changeAgentStatus } from '../../agentStatus'

export const saveTokenToFirestore = async (
  customerID: string,
  sipAccount: string,
  fcmToken: string
) => {
  if (!customerID || !sipAccount || !fcmToken) {
    return
  }
  try {
    const deviceRef = firestore()
      .collection('customers')
      .doc(customerID)
      .collection('deviceSF')
      .doc(sipAccount)

    await deviceRef.set({
      fcmTokenSF: fcmToken
    })
    console.warn('STORE FCM SUCCESS!')
  } catch (err: any) {
    console.error('Failed to store FCM', sipAccount, err)
  }
}

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
    updateTime: new Date(data.updateTime.seconds * 1000),
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

export const getAgents = async (
  customerId: string,
  username: string
): Promise<AgentStatusMap> => {
  const data: AgentStatusMap = {}

  try {
    const db = firestore()
    const agentRef = await db
      .collection('customers')
      .doc(customerId)
      .collection('agentStatuses')
      .where('username', '==', username)
      .get()

    agentRef.forEach(doc => {
      if (doc.exists) {
        const agent = createAgentStatus(doc.data())
        if (agent) {
          data[agent.userID] = agent
        }
      }
    })
  } catch (error) {
    return data
  }

  return data
}

export const handleChangeStatus =
  (status: number, auth: any, dataAgent: AgentStatusMap) =>
  async (): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
      if (status === undefined || status === null) {
        reject('Invalid status')
      }
      try {
        const [agent] = Object.values(dataAgent)
        if (!agent || !agent.groupNames || !agent.interface) {
          reject('Invalid data agent')
        }

        changeAgentStatus(
          auth?.customerID || '951a',
          agent.groupNames[0],
          agent.interface,
          '0',
          `${status}`
        )
          .then(res => {
            if (res.success) {
              resolve()
            } else {
              console.error(' 3. Change Status: FAILED ')
              console.error(res.message)
              reject(res.message)
            }
          })
          .catch(error => {
            console.error(' 3. Change Status: FAILED ')
            console.error(error)
            reject(error)
          })
      } catch (error) {
        console.error(' 3. Change Status: FAILED ')
        reject(error)
      }
    })
  }

export const getIncomingUserInfoByRTCSessionEvent = (
  e: IncomingRTCSessionEvent
): IncomingUserInfo => {
  const {
    request: { from }
  } = e

  return { displayName: from.display_name, userName: from.uri.user }
}
