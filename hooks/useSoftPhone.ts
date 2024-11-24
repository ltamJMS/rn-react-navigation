import { useEffect } from 'react'
import useBoundStore from '../stores'

export default function useSoftPhone() {
  const softPhone = useBoundStore(state => state.softPhone)

  useEffect(() => {
    if (!softPhone) {
      return
    }

    softPhone.on('connecting', data => {
      console.log('connecting', data)
    })

    softPhone.on('registered', data => {
      console.log('registered', data)
    })

    softPhone.on('registrationFailed', () => {
      console.log('registrationFailed')
    })

    softPhone.on('newRTCSession', data => {
      console.log('newRTCSession', data)
    })
  }, [softPhone])
}
