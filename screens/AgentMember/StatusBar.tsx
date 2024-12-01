import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import User from '../../services/models/User'
import {
  changeAgentStatus,
  getASText,
  getDisplayStatus,
  getStatusStyle,
  logoutAgent
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
  canSFRegisterState
} from '../../services/store/softphone'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'
import LoginBtn from './LoginBtn'
import LogoutBtn from './LogoutBtn'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import Feather from 'react-native-vector-icons/Feather'
import { useSoftPhoneContext } from '../../SoftPhoneProvider'

const SHOWABLE_STATUS_MAX = 4

const StatusBar: React.FC = () => {
  const { softPhone } = useSoftPhoneContext()
  const sipAccountData = useRecoilValue(sipAccountState)
  const tenant = useRecoilValue(tenantState)
  const [expanded, setExpanded] = useState(false)
  const [index, setIndex] = useState(0)
  const [showMorePopover, setShowMorePopover] = useState(false)
  const moreButtonRef = useRef(null)
  const [isWebRTCUser] = useRecoilState(isWebRTCUserState)
  const auth = useRecoilValue(authState)
  const setAgentStatus = useSetRecoilState(agentStatusesState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const { agentStatus } = currentUser || {}
  const setCanSFRegister = useSetRecoilState(canSFRegisterState)
  const { handleLogin, handleLogout } = useSoftPhone()
  const [availableStatuses, setAvailableStatuses] = useState<number[]>()
  const [showableStatusMax, setShowableStatusMax] =
    useState<number>(SHOWABLE_STATUS_MAX)
  const [agentLoginStatus, setAgentLoginStatus] =
    useRecoilState(agentLoginState)
  const [loading, setLoading] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)

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

            if (auth?.roles.includes(Role['soft-phone:normal'])) {
              setCanSFRegister(true)
            }
          }, 1000)
          setLoading(false)
          return { success: true }
        } else {
          setLoading(false)
          return { success: false }
        }
      } catch (error: any) {
        setLoading(false)
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
  const handleStatusChange = (status: number, isFromPopover = false) => {
    setLoading(true)
    handleChangeStatus(status)().then(res => {
      if (res.success) {
        if (isFromPopover) {
          // Find index of the selected status in the tabs array
          const tabIndex = tabs.findIndex(tab => tab.status === status)
          // Update the segment control index if status is part of the visible tabs
          if (tabIndex !== -1) {
            setIndex(tabIndex)
          }
          setShowMorePopover(false)
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
  }
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
    setShowableStatusMax(SHOWABLE_STATUS_MAX)
  }, [currentUser?.agentStatus?.status, tenant?.agentStatusText])

  const tabs = (availableStatuses &&
    availableStatuses.slice(0, showableStatusMax).map(status => ({
      label: tenant?.agentStatusText[status],
      status
    }))) || [
    { label: '待機中', status: 0 },
    { label: 'ワーク', status: 2 },
    { label: '離席', status: 3 }
  ]

  const moreTabs =
    availableStatuses?.slice(showableStatusMax).map(status => ({
      label: tenant?.agentStatusText[status],
      status
    })) || []

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

  const handlePopoverStatusChange = async (status: number) => {
    setLoading(true)
    setShowMorePopover(false)
    if (status === 1) {
      // SFログアウト

      const { sipAccount, domain, agent } = sipAccountData

      if (!softPhone) {
        setLoading(false)
        return
      }
      softPhone.unregister({ all: true })
      await new Promise(resolve => setTimeout(resolve, 2000))
      const resLogoutAgent = await logoutAgent(
        sipAccount,
        agent.agentAccount,
        domain
      )
      if (resLogoutAgent.success) {
        setLoading(false)
        setAgentLoginStatus(false)
      } else {
        setLoading(false)
      }
      return
    } else {
      handleStatusChange(status, true)
      setIndex(3)
    }
  }

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
              <View style={styles.segmentAndMoreContainer}>
                {agentLoginStatus ? (
                  <>
                    <SegmentedControl
                      tabs={tabs.map(tab => tab.label)}
                      onChange={selectedIndex => {
                        handleSegmentChange(selectedIndex)
                      }}
                      value={index}
                      style={{ flex: 1, height: 40 }}
                    />
                    <TouchableOpacity
                      ref={moreButtonRef}
                      onPress={() => setShowMorePopover(true)}
                      style={{
                        paddingLeft: 8
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <Feather
                          name="more-vertical"
                          size={22}
                          color="#414141"
                        />
                      )}
                    </TouchableOpacity>
                    <Popover
                      isVisible={showMorePopover}
                      from={moreButtonRef}
                      onRequestClose={() => setShowMorePopover(false)}
                      placement={PopoverPlacement.BOTTOM}
                    >
                      <View style={styles.popoverContainer}>
                        {moreTabs.map(tab => (
                          <TouchableOpacity
                            key={tab.status}
                            style={styles.popoverButton}
                            onPress={() =>
                              handlePopoverStatusChange(tab.status)
                            }
                          >
                            <Text style={styles.popoverButtonText}>
                              {tab.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </Popover>
                  </>
                ) : (
                  <LoginBtn
                    handleClick={async () => {
                      handleLogin(setLoading)
                    }}
                    loading={loading}
                  />
                )}
              </View>
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
  },
  segmentAndMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24
  },
  popoverContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8
  },
  popoverButton: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  popoverButtonText: {
    color: 'black',
    fontSize: 16
  }
})

export default StatusBar
