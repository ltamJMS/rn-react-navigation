import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode
} from 'react'
import {
  InfinitalkSIP,
  SipConfig
} from './services/usecases/auth/InfinitalkSIP'

interface SoftPhoneProviderProps {
  children: ReactNode
}

interface SoftPhoneContextType {
  softPhone: InfinitalkSIP | null
  setupSoftPhone: (sipConfig: SipConfig) => void
}

const SoftPhoneContext = createContext<SoftPhoneContextType | undefined>(
  undefined
)

export const SoftPhoneProvider: React.FC<SoftPhoneProviderProps> = ({
  children
}) => {
  const [softPhone, setSoftPhone] = useState<InfinitalkSIP | null>(null)

  const setupSoftPhone = (sipConfig: SipConfig) => {
    const newSoftPhone = new InfinitalkSIP(sipConfig, {
      listenCall: true,
      listenUA: true
    })
    setSoftPhone(newSoftPhone)
  }

  const value = useMemo(() => ({ softPhone, setupSoftPhone }), [softPhone])

  return (
    <SoftPhoneContext.Provider value={value}>
      {children}
    </SoftPhoneContext.Provider>
  )
}

export const useSoftPhoneContext = (): SoftPhoneContextType => {
  const context = useContext(SoftPhoneContext)
  if (!context) {
    throw new Error(
      'useSoftPhoneContext must be used within a SoftPhoneProvider'
    )
  }
  return context
}
