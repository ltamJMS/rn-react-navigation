import { firebase } from '@react-native-firebase/firestore'
import {
  FirestoreListenHandler,
  UnsubscribeListen
} from '../../models/Firebase'
import { Group } from '../../models/Group'

const createGroup = (data: any): Group | undefined => {
  if (!data.id || !data.name || !data.dispName) {
    return undefined
  }

  return {
    id: data.id,
    name: data.name,
    dispName: data.dispName,
    callWaitTime: data.callWaitTime ? data.callWaitTime : 0,
    callWaiting: data.callWaiting ? data.callWaiting : 0
  }
}

export const listenGroups = (
  customerId: string,
  handler: FirestoreListenHandler<Group>
): UnsubscribeListen => {
  const db = firebase.firestore()
  const unsubcribe = db
    .collection('customers')
    .doc(customerId)
    .collection('groups')
    .orderBy('dispName')
    .onSnapshot(temp => {
      temp.docChanges().forEach(group => {
        const groupData = createGroup(group.doc.data())
        if (groupData) {
          if (group.type === 'added' && handler.onAdded) {
            handler.onAdded(groupData)
          } else if (group.type === 'modified' && handler.onModified) {
            handler.onModified(groupData)
          } else if (group.type === 'removed' && handler.onRemoved) {
            handler.onRemoved(groupData)
          }
        }
      })
    })

  return () => {
    unsubcribe()
  }
}
