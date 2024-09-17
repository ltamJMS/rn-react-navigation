import { AxiosError } from 'axios'

export interface Error {
  getMessage(): string
}

export interface CustomError {
  message: string
  code?: number
  detail?: string
}

export interface HTTPResResult {
  success: boolean
  code?: number
  message?: string
  detail?: any
}

export class HTTPError implements Error {
  message: string
  code: number
  detail?: string

  constructor(err: AxiosError | undefined) {
    if (err) {
      console.error('error', err)
      let code = 500
      let message = 'SERVER_ERROR'
      let detail
      console.error(err)
      if (err.response && err.response.data) {
        const res = err.response
        code = res.status
        message = err.message || `ERROR - code ${code}`
      } else if (err.message.toLowerCase().includes('network error')) {
        message = 'NETWORK_ERROR'
        detail = err.message
      } else if (err.message.toLowerCase().includes('timeout')) {
        message = 'TIMEOUT_ERROR'
        detail = err.message
      } else if (err.message) {
        detail = err.message
      }

      switch (code) {
        case 500:
          detail = 'サーバーに接続できません'
          break
        case 401:
          detail =
            'セッションがタイムアウトしました。再度サインインしてください'
          break
      }

      this.message = message
      this.code = code
      this.detail = detail
    } else {
      this.message = 'SERVER_ERROR'
      this.code = 500
      this.detail = 'サーバーに接続できません'
    }
  }

  getMessage = (): string => this.message
  getCode = (): number => this.code || 500
  getDetail = (): string => this.detail || ''
  getCustomError = (): CustomError => ({
    message: this.detail || '',
    code: this.code
  })
}
