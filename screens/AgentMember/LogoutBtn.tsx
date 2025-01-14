import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

interface LoginBtnProps {
  handleClick: () => void
  loading: boolean
}
const LoginBtn: React.FC<LoginBtnProps> = ({ handleClick, loading }) => {
  return (
    <View
      style={{
        height: 38,
        marginTop: 12
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#444444',
            paddingHorizontal: 16,
            height: 34,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            flexDirection: 'row'
          }}
          onPress={() => handleClick()}
        >
          <Icon name="power" color="#fff" size={16} />
          <Text style={{ color: '#fff', marginLeft: 4 }}>サインアウト</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default LoginBtn
