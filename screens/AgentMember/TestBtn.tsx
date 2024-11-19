import React from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'

interface TestBtnProps {
  handleClick: () => void
}
const TestBtn: React.FC<TestBtnProps> = ({ handleClick }) => {
  return (
    <View>
      <Text style={{ fontSize: 15 }}>電話機を起動しますか？</Text>
      <Button
        icon="power-standby"
        mode="contained-tonal"
        style={{
          backgroundColor: 'rgba(0, 122, 255, 0.15)',
          width: 120,
          height: 38
        }}
        onPress={() => handleClick()}
      >
        Test Btn
      </Button>
    </View>
  )
}

export default TestBtn
