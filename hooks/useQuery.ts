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
import axiosInstance from 'libs/axios_instance'

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
    queryKey: key
  }: QueryFunctionContext): Promise<TQueryFnData> => {
    try {
      const data = await axiosInstance<TError, { data: TQueryFnData }>({
        ...config,
        url: `${key?.[0]}`,
        method: config?.method || 'GET'
      }).then((response) => response.data)

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

  return RQUseQuery(
    {
      queryKey,
      queryFn: queryFn || defaultQueryFn,
      ...restOptions
    },
    queryClient
  )
}
