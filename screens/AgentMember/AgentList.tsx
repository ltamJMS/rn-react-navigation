import React, { FC } from 'react'
import { FlatList, View, Text } from 'react-native'
import { styles } from './styles'
import { Avatar, IconButton, List } from 'react-native-paper'
import { MD3Colors } from 'react-native-paper'
import AgentStatus, { AgentStatusMap } from '../../services/models/softPhone'
import { getASText, getDisplayStatus } from '../../services/agentStatus'
import { useRecoilValue } from 'recoil'
import { tenantState } from '../../services/store/tenant'
import Icon from 'react-native-vector-icons/Ionicons'
// Helper function
const getStatusStyle = (dispStatus: number) => {
  switch (dispStatus) {
    case 0:
      return { color: '#0564d4', icon: 'headset', size: 12, callable: true }
    case 1:
      return { color: '#757575', icon: 'power', size: 14, callable: false }
    case 78:
    case 88:
    case 98:
    case 79:
    case 89:
    case 99:
      return {
        color: '#1f9900',
        icon: 'pulse-sharp',
        size: 12,
        callable: false
      }
    case 2:
    case 3:
    default:
      return { color: '#d658d0', icon: 'airplane', size: 14, callable: true }
  }
}

interface Props {
  agents?: AgentStatusMap
}

const AgentList: FC<Props> = props => {
  const { agents } = props
  const tenant = useRecoilValue(tenantState)

  if (!agents || Object.keys(agents).length === 0) {
    return <Text> </Text>
  }

  if (!tenant) {
    return <Text> </Text>
  }

  const agentArray = Object.values(agents)

  const renderItem = ({ item }: { item: AgentStatus }) => {
    const dispStatus = getDisplayStatus(item.phoneStatus || 0, item.status || 0)
    const statusText = getASText(
      item.phoneStatus || 0,
      item.status || 0,
      tenant
    )
    const { color, icon, size, callable } = getStatusStyle(dispStatus)

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Avatar.Icon
            size={30}
            icon="face-agent"
            color={MD3Colors.neutral20}
            style={styles.avatar}
          />
          <View>
            <Text numberOfLines={1}>{`${item.name} | ${item.userID}`}</Text>
            <View style={styles.descriptionContainer}>
              <Text>{item.exten}</Text>
              <Icon name={icon} color={color} style={styles.icon} size={size} />
              <Text style={{ color }} numberOfLines={2}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>

        <IconButton
          icon="phone"
          size={22}
          style={styles.iconButton}
          iconColor={`${callable ? '#0564d4' : '#cfcfcf'}`}
        />
      </View>
    )
  }

  return (
    <FlatList
      data={agentArray}
      renderItem={renderItem}
      keyExtractor={item => item.userID.toString()}
      // eslint-disable-next-line react/no-unstable-nested-components
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  )
}

export default AgentList
