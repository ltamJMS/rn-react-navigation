export type UnsubscribeListen = () => void
export interface FirestoreListenHandler<T> {
  onAdded?: (data: T, metaData?: any) => void
  onModified?: (data: T, metaData?: any) => void
  onRemoved?: (condition: Partial<T>, metaData?: any) => void
  onData?: (data: T) => void
  onError?: (error: Error) => void
}

// delete Partial in onRemoved
export interface FirestoreListenHandlerNew<T> {
  onAdded?: (data: T, metaData?: any) => void
  onModified?: (data: T, metaData?: any) => void
  onRemoved?: (condition: T, metaData?: any) => void
  onData?: (data: T) => void
  onError?: (error: Error) => void
}
