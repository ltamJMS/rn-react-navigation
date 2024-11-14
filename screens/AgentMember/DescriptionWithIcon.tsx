import React from 'react'
import { View, Text } from 'react-native'
import { getStatusStyle } from '../../services/agentStatus'
import Icon from 'react-native-vector-icons/Ionicons'

const DescriptionWithIcon = ({
  exten,
  statusText,
  userID,
  dispStatus
}: {
  exten: string
  statusText: string
  userID: string
  dispStatus: number
}) => {
  const { color, icon } = getStatusStyle(dispStatus)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name={icon} size={20} color={color} />
      <Text
        style={{ color }}
      >{`${exten} ${statusText} | userID: ${userID}`}</Text>
    </View>
  )
}

export default DescriptionWithIcon
