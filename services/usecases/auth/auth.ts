import auth from '@react-native-firebase/auth'
import configs from '../../configs'
import { AuthUser, Token } from '../../models/account'
import { HTTPError } from '../../models/error'
import axios from 'axios'
const { apiRoot, clientID } = configs

export async function loginByPassword(
  username: string,
  password: string
): Promise<AuthUser | HTTPError> {
  try {
    const res = await axios.post(
      `${apiRoot}/v1/auth?needs[]=access-token&needs[]=firebase-access-token&needs[]=license`,
      {
        username,
        password,
        app: clientID,
        requiredRoles: ['infinitalk:manager', 'chat:normal']
      }
    )

    const { data } = res.data

    const authUser = new AuthUser(
      data.id,
      new Token(data.accessToken, data.firebaseAccessToken),
      data.username,
      data.roles,
      data.name,
      data.agreementID,
      data.clientAppLicense,
      data.companyId
    )
    return authUser
  } catch (err: any) {
    const httpErr = new HTTPError(err)
    return httpErr
  }
}

export async function applyToken(token: Token): Promise<void> {
  axios.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`
  await auth().signInWithCustomToken(token.firebaseToken)
}

export const getSipAccount = async (
  username: string,
  customerId: string
): Promise<any> => {
  try {
    const url = `${apiRoot}/v1/agents/users/${username}/sip-account?customerId=${customerId}`
    const res = await axios.get(url)
    return {
      data: {
        account: res.data.data.sipAccount,
        password: res.data.data.sipPassword,
        sipType: res.data.data.sipType,
        agent: res.data.data.agent,
        transport: res.data.data?.transport || 'wss',
        domain: res.data.data.domain,
        asteriskDomain: res.data.data?.asteriskDomain,
        port: '8089'
      }
    }
  } catch (err: any) {
    const httpErr = new HTTPError(err)

    return {
      message: httpErr.getMessage(),
      error: httpErr.getCustomError()
    }
  }
}
