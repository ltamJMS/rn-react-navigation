import { Status } from '../types'
import {
  API_ROOT,
  API_GATEWAY_DOMAIN,
  CONTROLLER_API_ROOT,
  INFINITALK_CONSOLE_WEB_DOMAIN
} from '@env'

export const TOKEN_KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token'
}

export const STATUSES: Status[] = [
  { value: '0', label: '待機中' },
  { value: '1', label: 'ログオフ' },
  { value: '2', label: 'ワーク' },
  { value: '3', label: '離席' },
  { value: '4', label: '昼食' },
  { value: '5', label: 'web会議中' },
  { value: '6', label: '理論転送オフ' },
  { value: '7', label: '自動ワーク' }
]

export const SHOWABLE_STATUS_MAX = 8

export const DOMAINS = {
  API_ROOT,
  API_GATEWAY_DOMAIN,
  CONTROLLER_API_ROOT,
  INFINITALK_CONSOLE_WEB_DOMAIN
}
