import axios from 'axios'
import qs from 'qs'
import configs from './configs'
const { apiGatewayDomain } = configs

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

export const loginAgentByPrivateIP = async (
  sipaccount: string,
  sippassword: string,
  account: string,
  password: string,
  domain: string
): Promise<any> => {
  const axiosWithoutToken = axios.create({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

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
    console.error('🔴 CHANGE STATUS FAILED', err)
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
