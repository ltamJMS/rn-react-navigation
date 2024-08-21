import { QueryClient } from '@tanstack/react-query'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { clearTokens, getTokens, storeTokens } from '../utils'
import useBoundStore from '../store'
import { API_URL } from '@env'

const apiDomain = API_URL

let refreshTokenRequest: null | Promise<void> = null
export const queryClient = new QueryClient()

const defaultHeaders = {
  'Content-Type': 'application/json'
}

const axiosInstance = axios.create({
  baseURL: apiDomain,
  headers: defaultHeaders
})

const refresh = async () => {
  try {
    const { refreshToken } = await getTokens()

    const response = await axios.post(`${apiDomain}v1/auth/token/refresh`, {
      refreshToken
    })
    storeTokens(response.data.data)

    return response.data.data.accessToken
  } catch (error: unknown) {
    refreshTokenRequest = null
    clearTokens()

    if (error instanceof AxiosError && error.response?.status === 401) {
      // useBoundStore.getState().unAuthenticate()
      queryClient.setQueryData(['users/2'], null)
      queryClient.removeQueries()
    }

    return Promise.reject(error)
  }
}

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
    refreshTokenRequest = refreshTokenRequest || refresh()

    const newAccessToken = await refreshTokenRequest

    const axiosConfig = {
      ...error.config,
      headers: {
        ...error.config?.headers,
        authorization: `Bearer ${newAccessToken}`
      }
    }

    refreshTokenRequest = null

    return axiosInstance(axiosConfig)
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.request.use(onRequest, onRequestError)
axiosInstance.interceptors.response.use(onResponse, onResponseError)

export default axiosInstance
