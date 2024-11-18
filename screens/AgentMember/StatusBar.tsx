import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import User from '../../services/models/User'
import {
  getASText,
  getDisplayStatus,
  getStatusStyle
} from '../../services/agentStatus'
import { useRecoilValue } from 'recoil'
import { tenantState } from '../../services/store/tenant'
import SegmentedControl from 'react-native-segmented-control-2'
import Logout from './Logout'
import { CollapsableContainer } from './CollapsableContainer'

/** status to show in segment control
    0	待機中
    1 ログオフ
    2	ワーク
    3	離席
    4 昼食
    5 web会議中
    6 理論転送オフ
    7 自動ワーク
    **/

interface StatusBarProps {
  currentUser: User | null
}
const StatusBar: React.FC<StatusBarProps> = ({ currentUser }) => {
  const tenant = useRecoilValue(tenantState)
  const { agentStatus } = currentUser || {}
  const { phoneStatus, status } = agentStatus || {}
  const [expanded, setExpanded] = useState(false)
  const [index, setIndex] = useState(0)

  // check agentStatus to shoe statusCode

  const onItemPress = () => {
    setExpanded(!expanded)
  }

  if (!currentUser || !tenant)
    return (
      <View>
        <Text> Loading ...</Text>
      </View>
    )

  const dispStatus = getDisplayStatus(phoneStatus || 0, status || 0)
  const statusText = getASText(phoneStatus || 0, status || 0, tenant)
  const { color, icon, size } = getStatusStyle(dispStatus)
  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={onItemPress}>
        <View>
          <View style={styles.container}>
            <Image
              source={require('../../assets/images/logoApp.png')}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <View style={styles.descriptionContainer}>
                <Icon
                  name={icon}
                  color={color}
                  style={{ marginRight: 4 }}
                  size={size}
                />
                <Text style={{ color }}>{statusText}</Text>
              </View>
            </View>
            <Icon
              name={'settings-outline'}
              size={20}
              color="#414141"
              style={{ borderBlockColor: 'black' }}
            />
          </View>
          <CollapsableContainer expanded={expanded}>
            <View
              style={{
                width: '100%',
                backgroundColor: '#FFF',
                marginVertical: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <SegmentedControl
                tabs={['待機中', 'ワーク', '離席', 'ログオフ']}
                onChange={setIndex}
                value={index}
                style={{ width: '100%', marginBottom: 24 }}
              />
              <Logout />
            </View>
          </CollapsableContainer>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#A2A2A2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginTop: 16,
    marginBottom: 4
  },
  avatar: {
    width: 30,
    height: 30
  },
  textContainer: {
    flex: 1,
    marginLeft: 16
  },
  name: {
    fontSize: 16,
    fontWeight: 'medium'
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  }
})

export default StatusBar
