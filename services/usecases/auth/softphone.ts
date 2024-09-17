import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-toast-message'
import { Alert } from 'react-native'
import { InfinitalkSIP } from './InfinitalkSIP'
import { IncomingRTCSessionEvent } from 'jssip/lib/UA'
import { IncomingUserInfo } from '../../models/softPhone'
import { changeAgentStatus, logoutAgent } from '../../agentStatus'

export const saveTokenToFirestore = async (
  customerID: string,
  sipAccount: string,
  fcmToken: string
) => {
  if (!customerID || !sipAccount || !fcmToken) return
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

export const handleChangeStatus =
  (
    status: number,
    auth: any,
    setLoadingText: React.Dispatch<React.SetStateAction<string>>
  ) =>
  async (): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
      if (status === undefined || status === null) {
        reject('Invalid status')
      }
      try {
        changeAgentStatus(
          auth?.customerID || '951a',
          'a_acd_01',
          'Local/301@a_context_01/n',
          '0',
          `${status}`
        )
          .then(res => {
            if (res.success) {
              setLoadingText('Updated Status ...')
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

export const handleLogout = (
  sipInstance: InfinitalkSIP | null,
  sipAccountData: any,
  logout: () => void
) => {
  const { sipAccount, domain, agent } = sipAccountData

  if (sipInstance) {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: async () => {
          if (sipInstance) {
            sipInstance.unregister()
            // if (sipInstance.closeTrack) sipInstance.closeTrack();
          }
          const resLogoutAgent = await logoutAgent(
            sipAccount,
            agent.agentAccount,
            domain
          )
          if (resLogoutAgent.success) {
            Toast.show({
              type: 'success',
              text1: 'Logout Agent successfully!'
            })
            logout()
          } else {
            Alert.alert('Logout', `Logout failed: ${resLogoutAgent.message}`)
          }
        }
      }
    ])
  } else {
    logout()
  }
}

export const getIncomingUserInfoByRTCSessionEvent = (
  e: IncomingRTCSessionEvent
): IncomingUserInfo => {
  const {
    request: { from }
  } = e

  return { displayName: from.display_name, userName: from.uri.user }
}
