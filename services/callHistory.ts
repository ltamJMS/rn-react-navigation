import axios from 'axios'
import { Response } from './models/Response'
import { HTTPError } from './models/error'

export const getCallHistory = async (
  token: any,
  search: any
): Promise<Response<any>> => {
  const url = `https://asia-northeast1-development-201811.cloudfunctions.net/callHistoryApiFunction/call-logs?fromDate=2020/5/10&toDate=2025/12/16&fromTime=00:00&toTime=24:00&sourceDatabase=TEXT_SERVICE&searchFilter=${search}`
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}` // If using Bearer token
      },
      timeout: 60000
    })
    return {
      success: true,
      data: res.data // Added .data to extract the data from the response
    }
  } catch (err: any) {
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

export const getSignedUrl = async (
  contactUrl: string,
  operatorUrl: string,
  token: any
): Promise<Response<any>> => {
  const url =
    'https://asia-northeast1-development-201811.cloudfunctions.net/callHistoryApiFunction/call-logs/record-public-link'
  try {
    const res = await axios.post(
      url,
      {
        // Body của yêu cầu POST
        sourceDatabase: 'TEXT_SERVICE',
        gcpRecordLinks: [contactUrl, operatorUrl]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 60000
      }
    )

    return {
      success: true,
      data: res.data.data
    }
  } catch (err: any) {
    console.error('Error getSignedUrl', err)
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
