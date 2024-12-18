import { AxiosRequestConfig } from 'axios'

import {
  DefaultError,
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  useQuery as RQUseQuery,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query'

import axiosInstance from '_libs/axios_instance'

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    config?: AxiosRequestConfig
    onSuccess?: (data: TQueryFnData) => Promise<void> | void
    onError?: (error: unknown) => Promise<void> | void
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> {
  const { config, queryKey, queryFn, onSuccess, onError, ...restOptions } =
    options

  const defaultQueryFn: QueryFunction<TQueryFnData, TQueryKey> = async ({
    queryKey: key
  }: QueryFunctionContext): Promise<TQueryFnData> => {
    try {
      const url = key.join('/')

      const { data } = await axiosInstance<TError, { data: TQueryFnData }>({
        ...config,
        url,
        method: config?.method || 'GET'
      })

      if (onSuccess) {
        await onSuccess(data)
      }

      return data
    } catch (error) {
      if (onError) {
        await onError(error)
      }

      throw error
    }
  }

  return RQUseQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      queryKey,
      queryFn: queryFn || defaultQueryFn,
      ...restOptions
    },
    queryClient
  )
}
