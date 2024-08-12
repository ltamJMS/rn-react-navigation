import {
  DefaultError,
  MutationFunction,
  QueryClient,
  useMutation as RQUseMutation,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'
import axiosInstance from '../libs/axiosInstance'

export default function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    config?: AxiosRequestConfig
    url: string
  },
  queryClient?: QueryClient
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { mutationFn, config, url, ...restOptions } = options

  const defaultMutationFn: MutationFunction<TData, TVariables> = async (
    variables: TVariables
  ): Promise<TData> =>
    axiosInstance<TError, TData>({
      ...config,
      url,
      method: config?.method || 'POST',
      data: variables
    })

  return RQUseMutation(
    {
      mutationFn: mutationFn || defaultMutationFn,
      ...restOptions
    },
    queryClient
  )
}
