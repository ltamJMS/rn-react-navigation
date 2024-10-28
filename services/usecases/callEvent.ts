import firestore from '@react-native-firebase/firestore'

const getSnapshotData = async (
  customerId: string,
  sipAccount: string,
  linkedId: string
) => {
  try {
    const documentRef = firestore()
      .collection('customers')
      .doc(customerId)
      .collection('amiEventsMobile')
      .doc(sipAccount)
      .collection('linkedIds')
      .doc(linkedId)

    documentRef.onSnapshot((snapshot: any) => {
      if (snapshot.exists) {
        const data = snapshot.data()
        console.log('🍀 LINKED_ID', data)
      }
    })
  } catch (error) {
    console.error('🔴 ERROR GETTING LINKED ID', error)
  }
}

export default getSnapshotData
