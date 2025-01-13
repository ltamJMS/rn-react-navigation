import axios from 'axios'
import { Response } from './models/Response'
import { HTTPError } from './models/error'

export const getCallHistory = async (): Promise<Response<any>> => {
  const url =
    'https://asia-northeast1-development-201811.cloudfunctions.net/callHistoryApiFunction?fromDate=2023/5/10&toDate=2025/12/16&fromTime=00:00&toTime=24:00&sourceDatabase=TEXT_SERVICE'
  try {
    const res = await axios.get(url, { timeout: 60000 })
    console.log('000000 getCallHistory res:', res)

    return {
      success: true,
      data: res
    }
  } catch (err: any) {
    console.log('000000 getCallHistory err:', err)
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
