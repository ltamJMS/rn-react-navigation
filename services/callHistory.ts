import axios from 'axios'
import { Response } from './models/Response'
import { HTTPError } from './models/error'

export const getCallHistory = async (token: any): Promise<Response<any>> => {
  const url =
    'https://asia-northeast1-development-201811.cloudfunctions.net/callHistoryApiFunction/call-logs?fromDate=2020/5/10&toDate=2025/12/16&fromTime=00:00&toTime=24:00&sourceDatabase=TEXT_SERVICE'

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}` // If using Bearer token
      },
      timeout: 60000
    })

    console.log('000000 getCallHistory res:', res)

    return {
      success: true,
      data: res.data // Added .data to extract the data from the response
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
