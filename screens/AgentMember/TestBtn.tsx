import React from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'

interface TestBtnProps {
  handleClick: () => void
  btnName: string
}
const TestBtn: React.FC<TestBtnProps> = ({ handleClick, btnName }) => {
  return (
    <View>
      <Button
        icon="power-standby"
        mode="contained-tonal"
        style={{
          backgroundColor: 'rgba(0, 122, 255, 0.15)',
          width: 120,
          height: 38,
          marginVertical: 10
        }}
        onPress={() => handleClick()}
      >
        {btnName}
      </Button>
    </View>
  )
}

export default TestBtn
