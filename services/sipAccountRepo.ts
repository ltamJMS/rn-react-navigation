import axios from 'axios'
import { Result } from './models/Response'
import { Account, CommonSip } from './models/softPhone'
import configs from './configs'
import { HTTPError } from './models/error'

export const getListSipAccountsAvailable = async (
  customerId: string,
  username: string
): Promise<Result<CommonSip[]>> => {
  try {
    // sipAvailable is currently being set to false, which means we will include all the sip being used to support saxa's case
    const url = `${configs.apiRoot}/v1/agents/sip-accounts?customerId=${customerId}&username=${username}&sipAvailable=false`
    const res = await axios.get(url, { timeout: 10000 })

    return { data: res.data.data.items }
  } catch (err: any) {
    const httpErr = new HTTPError(err)

    return {
      message: httpErr.getMessage(),
      error: httpErr.getCustomError()
    }
  }
}

export const checkIsWebRTCUser = async (
  customerId: string,
  username: string
): Promise<Result<boolean>> => {
  let isWebRTCUser = false

  try {
    const url = `${configs.apiRoot}/v1/agents/webrtc-users?customerId=${customerId}`
    const res = await axios.get(url)

    isWebRTCUser = res.data.data.items.find(
      (user: { username: string }) => user.username === username
    )
      ? true
      : false

    return { data: isWebRTCUser }
  } catch (err: any) {
    const httpErr = new HTTPError(err)

    return {
      message: httpErr.getMessage(),
      error: httpErr.getCustomError()
    }
  }
}

export const getListSipAccountsMapName = async (
  customerId: string
): Promise<Result<Account[]>> => {
  try {
    const url = `${configs.apiRoot}/v1/agents/sip-accounts/map-name?customerId=${customerId}&needToGetExten=yes`
    const res = await axios.get(url)
    return { data: res.data.data }
  } catch (err: any) {
    const httpErr = new HTTPError(err)

    return {
      message: httpErr.getMessage(),
      error: httpErr.getCustomError()
    }
  }
}
