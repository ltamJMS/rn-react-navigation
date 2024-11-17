import React from 'react'
import { Button } from 'react-native-paper'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'

const Logout = () => {
  const { handleLogout } = useSoftPhone()
  return (
    <Button
      icon="power-standby"
      mode="contained"
      style={{ backgroundColor: '#007AFF', width: 100, height: 38 }}
      onPress={() => handleLogout()}
    >
      Logout
    </Button>
  )
}

export default Logout
