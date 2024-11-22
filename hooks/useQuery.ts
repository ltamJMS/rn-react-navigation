import {
  DefaultError,
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  useQuery as RQUseQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import {AxiosRequestConfig} from 'axios';
import axiosInstance from '../libs/axios_instance';

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    config?: AxiosRequestConfig;
    onSuccess?: (data: TQueryFnData) => void;
    onError?: (error: TError) => void;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
  const qClient = useQueryClient();
  const defaultRetry = qClient.getDefaultOptions().queries?.retry;

  const {
    config,
    queryKey,
    queryFn,
    onSuccess,
    onError,
    retry: optionRetry,
    ...restOptions
  } = options;

  const retry = optionRetry || defaultRetry;

  const defaultQueryFn: QueryFunction<TQueryFnData, TQueryKey> = async ({
    queryKey: key,
  }: QueryFunctionContext): Promise<TQueryFnData> => {
    const data = await axiosInstance<TError, TQueryFnData>({
      ...config,
      url: `${key?.[0]}`,
      method: config?.method || 'GET',
    });

    onSuccess && onSuccess(data);

    return data;
  };

  return RQUseQuery(
    {
      queryKey,
      queryFn: queryFn || defaultQueryFn,
      retry: (failureCount, error) => {
        if (retry === false) {
          console.log(failureCount);
          onError && onError(error);

          return false;
        }

        if (retry === undefined) {
          failureCount >= 3 && onError && onError(error);
          return failureCount < 3;
        }

        if (typeof retry === 'number') {
          failureCount >= retry && onError && onError(error);
          return failureCount < retry;
        }

        return true;
      },
      ...restOptions,
    },
    queryClient,
  );
}
