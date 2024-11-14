import { firebase } from '@react-native-firebase/firestore'
import {
  FirestoreListenHandler,
  UnsubscribeListen
} from '../../models/Firebase'
import Tenant from '../../models/Tenant'
import { AgentStatusText } from '../../models/softPhone'

// TODO: handler error
export const listenTenant = (
  customerID: string,
  handler: FirestoreListenHandler<Tenant>
): UnsubscribeListen => {
  const db = firebase.firestore()
  const docRef = db.collection('customers').doc(customerID)
  const unsubscribe = docRef.onSnapshot(doc => {
    const data = doc.data()
    if (!data) {
      return
    }

    const tenant: Tenant = {
      id: data.id as number,
      customerID: data.customerID as string,
      agentStatusText: data.agentStatusText as AgentStatusText
    }

    if (handler.onData) {
      handler.onData(tenant)
    }
  })

  return () => {
    unsubscribe()
  }
}
