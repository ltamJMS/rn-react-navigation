import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { Button } from 'react-native-paper'

interface LoginBtnProps {
  handleClick: () => void
  loading: boolean
}
const LoginBtn: React.FC<LoginBtnProps> = ({ handleClick, loading }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 38,
        width: '100%'
      }}
    >
      <Text style={{ fontSize: 15 }}>アプリログアウト</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button
          icon="power"
          mode="contained"
          style={{
            backgroundColor: '#444444',
            width: '38%',
            height: 40
          }}
          onPress={() => handleClick()}
        >
          Logout
        </Button>
      )}
    </View>
  )
}

export default LoginBtn
