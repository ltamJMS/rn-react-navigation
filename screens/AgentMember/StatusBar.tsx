import React, { useCallback, useEffect, useState } from 'react'
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
  changeAgentStatus,
  getASText,
  getDisplayStatus,
  getStatusStyle
} from '../../services/agentStatus'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { tenantState } from '../../services/store/tenant'
import SegmentedControl from 'react-native-segmented-control-2'
import { CollapsableContainer } from './CollapsableContainer'
import {
  agentStatusesState,
  isWebRTCUserState
} from '../../services/store/agentStatus'
import {
  authState,
  currentUserState,
  sipAccountState
} from '../../services/store/auth'
import { Role } from '../../services/models/account'
import { Response } from '../../services/models/Response'
import {
  agentLoginState,
  canSFRegisterState,
  currentCallState
} from '../../services/store/softphone'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'
import useLogoutAgent from '../../services/usecases/auth/useLogoutAgent'
import LoginBtn from './LoginBtn'
import { useSoftPhoneContext } from '../../SoftPhoneProvider'
import { SipConfig } from '../../services/models/softPhone'
import LogoutBtn from './LogoutBtn'

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
const SHOWABLE_STATUS_MAX = 4

const StatusBar: React.FC = () => {
  const tenant = useRecoilValue(tenantState)
  const [expanded, setExpanded] = useState(false)
  const [index, setIndex] = useState(0)
  const [isWebRTCUser] = useRecoilState(isWebRTCUserState)
  const auth = useRecoilValue(authState)
  const setAgentStatus = useSetRecoilState(agentStatusesState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const { agentStatus } = currentUser || {}
  const setCanSFRegister = useSetRecoilState(canSFRegisterState)
  const { handleLogin, handleLogout } = useSoftPhone()
  const logoutAgent = useLogoutAgent({ unregisterSip: true })
  const [availableStatuses, setAvailableStatuses] = useState<number[]>()
  const [showableStatusMax, setShowableStatusMax] =
    useState<number>(SHOWABLE_STATUS_MAX)
  const [agentLoginStatus] = useRecoilState(agentLoginState)
  const [loading, setLoading] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const sipAccountData = useRecoilValue(sipAccountState)
  const [currentCall] = useRecoilState(currentCallState)
  const { setupSoftPhone } = useSoftPhoneContext()

  const setupSF = () => {
    const sipConfig: SipConfig = {
      account: sipAccountData.sipAccount,
      password: sipAccountData.sipPassword,
      domain: sipAccountData.domain,
      port: 8089
    }
    setupSoftPhone(sipConfig)
  }

  const isStatusButtonDisabled = useCallback(
    (statusValue: number): boolean => {
      const statusDisableDefault = [7]

      if (statusDisableDefault.includes(statusValue)) return true

      if (
        !isWebRTCUser ||
        (isWebRTCUser && !auth?.roles.includes(Role['soft-phone:normal']))
      )
        return true
      return false
    },
    [isWebRTCUser, auth?.roles]
  )

  const handleChangeStatus = useCallback(
    (status: number) => async (): Promise<Response> => {
      if (
        !currentUser ||
        !currentUser.agentStatus ||
        !currentUser.agentStatus.groupNames ||
        !currentUser.agentStatus.interface ||
        isStatusButtonDisabled(status)
      ) {
        return { success: false }
      }

      const change = changeAgentStatus(
        currentUser.customerID.startsWith('CRM') &&
          currentUser.infinitalkCustomerId
          ? currentUser.infinitalkCustomerId
          : currentUser.customerID,
        currentUser.agentStatus.groupNames[0],
        currentUser.agentStatus.interface
      )

      try {
        let res
        if (status === 0) {
          res = await change('0', `${status}`)
        } else {
          res = await change('1', `${status}`)
        }
        if (res.success) {
          setTimeout(() => {
            setAgentStatus((val: any) => {
              const updateCurrentUserAgentStatusShowOnSeatMap = {
                ...val[`${currentUser.agentStatus?.userID}`],
                status
              }
              return {
                ...val,
                [`${currentUser.agentStatus?.userID}`]:
                  updateCurrentUserAgentStatusShowOnSeatMap
              }
            })
            setCurrentUser((val: User | null) => {
              if (!val) {
                return val
              }
              return {
                ...val,
                agentStatus: {
                  ...val.agentStatus,
                  status
                }
              } as User
            })

            // if sip login successfully then enable sip register
            if (auth?.roles.includes(Role['soft-phone:normal'])) {
              setCanSFRegister(true)
            }
          }, 1000)
          setLoading(false)
          return { success: true }
        } else {
          console.error(111111111111, 'change status failed')
          setLoading(false)
          return { success: false }
        }
      } catch (error: any) {
        setLoading(false)
        console.error(111111111111, 'change status failed', error.message)
        return { success: false }
      }
    },
    [
      auth?.roles,
      currentUser,
      isStatusButtonDisabled,
      setAgentStatus,
      setCanSFRegister,
      setCurrentUser
    ]
  )

  // handle forced logout from another device
  useEffect(() => {
    if (isWebRTCUser && currentUser?.agentStatus?.sipAccount === undefined) {
      const logout = async () => {
        await logoutAgent()
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
      logout()
    }
  }, [currentUser?.agentStatus?.sipAccount, isWebRTCUser, logoutAgent])

  useEffect(() => {
    /** Statuses code
        0	待機中
        2	ワーク
        3	離席
        4	状態名称４
        5	状態名称５
        6	状態名称６
        7	状態名称７ (default is 自動ワーク. will be disabled by default)
       */
    const defaultStatuses = [0, 2, 3, 4, 5, 6, 7]

    // in lg or more screen, order of statuses were sorted same as defaultStatuses and set showable statuses to SHOWABLE_STATUS_MAX
    const statuses = defaultStatuses.filter(
      status => tenant?.agentStatusText[status]
    )
    const activeStatusIndex: number = statuses.findIndex(
      status => currentUser?.agentStatus?.status === status
    )

    if (activeStatusIndex > -1 && activeStatusIndex >= SHOWABLE_STATUS_MAX) {
      // eslint-disable-next-line no-extra-semi
      ;[statuses[SHOWABLE_STATUS_MAX - 1], statuses[activeStatusIndex]] = [
        statuses[activeStatusIndex],
        statuses[SHOWABLE_STATUS_MAX - 1]
      ]
    }

    setAvailableStatuses(statuses)
    setShowableStatusMax(SHOWABLE_STATUS_MAX)
  }, [currentUser?.agentStatus?.status, tenant?.agentStatusText])

  const tabs = (availableStatuses &&
    availableStatuses.slice(0, showableStatusMax).map(status => ({
      label: tenant?.agentStatusText[status],
      status
    }))) || [
    { label: 'label 1', status: 0 },
    { label: 'label 3', status: 2 },
    { label: 'label 4', status: 3 }
  ]

  const handleSegmentChange = (selectedIndex: number) => {
    setLoading(true)
    const selectedStatus = tabs[selectedIndex]?.status
    handleChangeStatus(selectedStatus)().then(res => {
      if (res.success) {
        setIndex(selectedIndex)
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
  }

  // TODO: implement logout agent
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
                marginVertical: 12,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View style={{ width: '100%', marginBottom: 24 }}>
                {agentLoginStatus ? (
                  <SegmentedControl
                    tabs={tabs.map(tab => tab.label)}
                    onChange={handleSegmentChange}
                    value={index}
                    style={{ width: '100%', height: 40 }}
                  />
                ) : (
                  <LoginBtn
                    handleClick={async () => {
                      await handleLogin(setLoading)
                      setupSF()
                    }}
                    loading={loading}
                  />
                )}
              </View>
              {currentCall && (
                <View>
                  <Text>Current Call: {currentCall.dst.num}</Text>
                </View>
              )}
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
