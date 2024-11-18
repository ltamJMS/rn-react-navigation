import React from 'react'
import { Button } from 'react-native-paper'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'

const Logout = () => {
  const { handleLogout } = useSoftPhone()
  return (
    <Button
      icon="power-standby"
      mode="contained-tonal"
      style={{
        backgroundColor: 'rgba(0, 122, 255, 0.15)',
        width: 120,
        height: 38
      }}
      onPress={() => handleLogout()}
    >
      Logout
    </Button>
  )
}

export default Logout
