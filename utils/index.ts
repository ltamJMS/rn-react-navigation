import { QueryClient, QueryKey } from '@tanstack/react-query'

export const getErrorMessage = (error: unknown) => {
  let message: string

  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Something went wrong'
  }

  return message
}

export const removeAllExceptKey = (
  queryClient: QueryClient,
  keyToKeep: QueryKey
) => {
  const queryCache = queryClient.getQueryCache()

  const keysToRemove = queryCache
    .getAll()
    .reduce((keys: QueryKey[], { queryKey }) => {
      if (JSON.stringify(queryKey) === JSON.stringify(keyToKeep)) {
        return keys
      }

      return [...keys, queryKey]
    }, [])

  if (keysToRemove.length > 0) {
    queryClient.removeQueries({ queryKey: keysToRemove })
  }
}
