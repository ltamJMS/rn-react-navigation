import React from 'react'
import { Button } from 'react-native-paper'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'

const Logout = () => {
  const { handleLogout } = useSoftPhone()
  return (
    <Button
      icon="power-standby"
      mode="contained"
      style={{ backgroundColor: '#444444', marginTop: 20, width: '50%' }}
      onPress={() => handleLogout()}
    >
      Logout
    </Button>
  )
}

export default Logout
