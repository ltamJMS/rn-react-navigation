import { SHOWABLE_STATUS_MAX, STATUSES } from '../constants'
import { AgentStatusText, Status } from '../types'

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

export const segmentedButtonsCalculator = (statusText?: AgentStatusText) => {
  const buttons = STATUSES?.reduce((acc: Status[], status, index) => {
    if (index >= SHOWABLE_STATUS_MAX) {
      return acc
    }

    return [
      ...acc,
      {
        label: statusText?.[status.value] ?? 'Unknown',
        value: status.value,
        checkedColor: 'green'
      }
    ]
  }, [])

  return buttons
}
