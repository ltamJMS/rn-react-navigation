import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  getASText,
  getDisplayStatus,
  getStatusStyle
} from '../../services/agentStatus'
import { useRecoilState, useRecoilValue } from 'recoil'
import { tenantState } from '../../services/store/tenant'
import { CollapsableContainer } from './CollapsableContainer'
import { currentUserState } from '../../services/store/auth'
import { agentLoginState } from '../../services/store/softphone'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'
import LogoutBtn from './LogoutBtn'
import LoginSFBar from './LoginSFBar'

const SHOWABLE_STATUS_MAX = 4

const StatusBar: React.FC = () => {
  const tenant = useRecoilValue(tenantState)
  const [expanded, setExpanded] = useState(false)
  const [currentUser] = useRecoilState(currentUserState)
  const { agentStatus } = currentUser || {}
  const { handleLogout } = useSoftPhone()
  const [availableStatuses, setAvailableStatuses] = useState<number[]>()
  const [agentLoginStatus] = useRecoilState(agentLoginState)
  const [loadingLogout, setLoadingLogout] = useState(false)

  useEffect(() => {
    const defaultStatuses = [0, 2, 3, 4, 5, 6, 1] // Removed ログオフ (1)
    const statuses = defaultStatuses.filter(
      status => tenant?.agentStatusText[status]
    )
    const activeStatusIndex: number = statuses.findIndex(
      status => currentUser?.agentStatus?.status === status
    )

    if (activeStatusIndex > -1 && activeStatusIndex >= SHOWABLE_STATUS_MAX) {
      ;[statuses[SHOWABLE_STATUS_MAX - 1], statuses[activeStatusIndex]] = [
        statuses[activeStatusIndex],
        statuses[SHOWABLE_STATUS_MAX - 1]
      ]
    }

    setAvailableStatuses(statuses)
  }, [currentUser?.agentStatus?.status, tenant?.agentStatusText])

  const onItemPress = () => {
    setExpanded(!expanded)
  }

  if (!currentUser || !tenant) return null
  const { phoneStatus, status } = agentStatus || {}

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
              {agentLoginStatus ? (
                <View style={styles.descriptionContainer}>
                  <Icon
                    name={icon}
                    color={color}
                    style={{ marginRight: 4 }}
                    size={size}
                  />
                  <Text style={{ color }}>{statusText}</Text>
                </View>
              ) : (
                <View style={styles.descriptionContainer}>
                  <Icon
                    name="power"
                    color="#757575"
                    style={{ marginRight: 4 }}
                    size={size}
                  />
                  <Text style={{ color: '#757575' }}>ログオフ</Text>
                </View>
              )}
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
                marginVertical: 4,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <LoginSFBar availableStatuses={availableStatuses} />
              <LogoutBtn
                handleClick={async () => {
                  handleLogout(setLoadingLogout)
                }}
                loading={loadingLogout}
              />
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
    marginTop: 5,
    height: 20
  }
})

export default StatusBar
