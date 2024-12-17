import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import { DOMAINS } from '../constants'
import useBoundStore from '../stores'
import { getTokens } from '../utils/token_storage'

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const axiosInstance = axios.create({
  baseURL: DOMAINS.API_ROOT,
  headers: defaultHeaders
})

const onRequest = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const { accessToken } = await getTokens()

  config.headers.set('Authorization', `Bearer ${accessToken}`)

  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error)

const onResponse = (response: AxiosResponse): AxiosResponse => response.data

const onResponseError = async (
  error: AxiosError
): Promise<AxiosResponse | AxiosError> => {
  if (error.response?.status === 401) {
    useBoundStore.getState().unAuthenticate()
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.request.use(onRequest, onRequestError)
axiosInstance.interceptors.response.use(onResponse, onResponseError)

export default axiosInstance
