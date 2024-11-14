/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError, HTTPError } from './Error'

export interface Response<T = undefined> {
  success: boolean
  message?: string
  data?: T
  error?: HTTPError
}

export interface SuccessResult {
  error?: never
}
export interface WithDataResult<T = any> {
  data: T
}
export interface FailedResult {
  data?: never
  message?: string
  error: CustomError
}
export type CustomResult<T = { [index: string]: any }> =
  | (SuccessResult & T)
  | FailedResult
export type Result<T> = (SuccessResult & WithDataResult<T>) | FailedResult
