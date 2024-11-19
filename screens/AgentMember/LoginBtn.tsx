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
        height: 40
      }}
    >
      <Text style={{ fontSize: 15 }}>電話機を起動しますか？</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button
          mode="elevated"
          onPress={() => handleClick()}
          textColor="#007AFF"
        >
          起動する
        </Button>
      )}
    </View>
  )
}

export default LoginBtn
