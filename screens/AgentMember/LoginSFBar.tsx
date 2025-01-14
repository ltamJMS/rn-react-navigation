import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { tenantState } from '../../services/store/tenant'
import {
  agentLoginState,
  canSFRegisterState
} from '../../services/store/softphone'
import {
  authState,
  currentUserState,
  sipAccountState
} from '../../services/store/auth'
import { changeAgentStatus, logoutAgent } from '../../services/agentStatus'
import User from '../../services/models/User'
import { agentStatusesState } from '../../services/store/agentStatus'
import { Role } from '../../services/models/account'
import { Response } from '../../services/models/Response'
import { useSoftPhoneContext } from '../../SoftPhoneProvider'
import { useSoftPhone } from '../../services/usecases/auth/useSoftPhone'

interface LoginSFBarProps {
  availableStatuses: number[] | undefined
}

const LoginSFBar: React.FC<LoginSFBarProps> = ({ availableStatuses }) => {
  const tenant = useRecoilValue(tenantState)
  const [loadingButton, setLoadingButton] = useState<number | null>(null)
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const [agentLoginStatus, setAgentLoginStatus] =
    useRecoilState(agentLoginState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const setAgentStatus = useSetRecoilState(agentStatusesState)
  const auth = useRecoilValue(authState)
  const setCanSFRegister = useSetRecoilState(canSFRegisterState)
  const sipAccountData = useRecoilValue(sipAccountState)
  const { softPhone } = useSoftPhoneContext()
  const { handleLogin } = useSoftPhone()
  const [, setLoading] = useState(false)
  const buttons =
    availableStatuses &&
    availableStatuses.map(status => ({
      label: tenant?.agentStatusText[status],
      status
    }))

  const handleChangeStatus = useCallback(
    (status: number) => async (): Promise<Response> => {
      if (
        !currentUser ||
        !currentUser.agentStatus ||
        !currentUser.agentStatus.groupNames ||
        !currentUser.agentStatus.interface
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
          setLoadingButton(null)
          setActiveButton(status)
          return { success: true }
        } else {
          setLoadingButton(null)
          return { success: false }
        }
      } catch (error: any) {
        setLoadingButton(null)
        return { success: false }
      }
    },
    [auth?.roles, currentUser, setAgentStatus, setCanSFRegister, setCurrentUser]
  )

  const handleLogoutSF = async (status: number) => {
    if (status !== 1) return
    setLoadingButton(status)
    // SFログアウト

    const { sipAccount, domain, agent } = sipAccountData

    if (!softPhone) {
      setLoadingButton(null)
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
      setLoadingButton(null)
      setAgentLoginStatus(false)
    } else {
      setLoadingButton(null)
    }
    return
  }

  const handleClickTest = async (status: number) => {
    try {
      setLoadingButton(status)

      if (status === 1) {
        await handleLogoutSF(status)
        return
      }
      if (agentLoginStatus) {
        // Change status, await the function to ensure it completes
        const response = await handleChangeStatus(status)()
        if (!response.success) {
          throw new Error('Failed to change status')
        }
      } else {
        // Login SF and then change status
        await handleLogin(setLoading, status)
        await handleChangeStatus(status)()
      }
    } catch (error) {
      console.error(error)
    } finally {
      // Always reset the loading button state after operation completes
      setLoadingButton(null)
    }
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      <View style={styles.buttonContainer}>
        {buttons?.map(button => (
          <TouchableOpacity
            key={button.status}
            style={[
              styles.buttonStatus,
              activeButton === button.status &&
                (button.status === 0
                  ? { backgroundColor: '#007AFF' }
                  : { backgroundColor: '#d658d0' })
            ]}
            onPress={() => handleClickTest(button.status)}
          >
            {loadingButton === button.status ? (
              <ActivityIndicator
                size="small"
                color="#333"
                style={{ width: 40 }}
              />
            ) : (
              <Text
                style={[
                  styles.buttonStatusText,
                  activeButton === button.status && { color: '#fff' } // đổi màu văn bản khi nút được kích hoạt
                ]}
              >
                {button.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonStatus: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 16,
    height: 34,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0.3,
    borderColor: '#DFDFDF',
    margin: 1.5
  },
  buttonStatusText: {
    fontSize: 15,
    textAlign: 'center'
  }
})

export default LoginSFBar
