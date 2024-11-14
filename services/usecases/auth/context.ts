import { firebase } from '@react-native-firebase/firestore'
import { Context } from '../../models/Context'
import {
  FirestoreListenHandler,
  UnsubscribeListen
} from '../../models/Firebase'

export const listenContexts = (
  customerId: string,
  handler: FirestoreListenHandler<Context>
): UnsubscribeListen => {
  const db = firebase.firestore()
  const unsubcribe = db
    .collection('customers')
    .doc(customerId)
    .collection('contexts')
    .where('name', '!=', false)
    .onSnapshot(temp => {
      temp.docChanges().forEach(context => {
        const contextData = context.doc.data()
        if (context.type === 'added' && handler.onAdded) {
          handler.onAdded(contextData as Context)
        } else if (context.type === 'modified' && handler.onModified) {
          handler.onModified(contextData as Context)
        } else if (context.type === 'removed' && handler.onRemoved) {
          handler.onRemoved(contextData as Context)
        }
      })
    })

  return () => {
    unsubcribe()
  }
}

type ContextData = { [index: string]: Context }
export const getContexts = async (customerId: string): Promise<ContextData> => {
  const data: ContextData = {}

  try {
    const db = firebase.firestore()
    const contextsRef = await db
      .collection('customers')
      .doc(customerId)
      .collection('contexts')
      .where('name', '!=', false)
      .get()

    contextsRef.docs.forEach(doc => {
      const context = doc.data()
      const { dispName, name, agentStatusThreshold, seatMapConfigs } = context
      data[context.name] = {
        dispName,
        name,
        agentStatusThreshold,
        seatMapConfigs
      }
    })
  } catch (error) {
    return data
  }

  return data
}
