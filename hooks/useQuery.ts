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
import { AxiosRequestConfig } from 'axios'
import axiosInstance from '../libs/axiosInstance'

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    config?: AxiosRequestConfig
    onSuccess?: (data: TQueryFnData) => void
    onError?: (error: unknown) => void
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> {
  const { config, queryKey, queryFn, onSuccess, onError, ...restOptions } =
    options

  const defaultQueryFn: QueryFunction<TQueryFnData, TQueryKey> = async ({
    queryKey
  }: QueryFunctionContext): Promise<TQueryFnData> => {
    try {
      const data = await axiosInstance<TError, TQueryFnData>({
        ...config,
        url: `${queryKey?.[0]}`,
        method: config?.method || 'GET'
      })

      onSuccess && onSuccess(data)

      return data
    } catch (error) {
      onError && onError(error)

      throw error
    }
  }

  return RQUseQuery(
    {
      queryKey,
      queryFn: queryFn || defaultQueryFn,
      ...restOptions
    },
    queryClient
  )
}
