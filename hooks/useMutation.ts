import {
  DefaultError,
  MutationFunction,
  QueryClient,
  useMutation as RQUseMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {AxiosRequestConfig} from 'axios';
import axiosInstance from '../libs/axios_instance';

export default function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    config?: AxiosRequestConfig;
    endpoint: string;
  },
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const {mutationFn, config, endpoint, ...restOptions} = options;

  const defaultMutationFn: MutationFunction<TData, TVariables> = async (
    variables: TVariables,
  ): Promise<TData> =>
    axiosInstance<TError, TData>({
      ...config,
      url: endpoint,
      method: config?.method || 'POST',
      data: variables,
    });

  return RQUseMutation(
    {
      mutationFn: mutationFn || defaultMutationFn,
      ...restOptions,
    },
    queryClient,
  );
}
