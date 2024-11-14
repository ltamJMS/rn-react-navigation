import { useRecoilState } from 'recoil'
import { AuthUser } from '../../models/account'
import { authState } from '../../store/auth'
import useLogout from './useLogout'
import { useEffect } from 'react'
import { applyToken } from './auth'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../../../shared/constants'
const useAuth = (): AuthUser | undefined => {
  const [auth, setAuth] = useRecoilState(authState)
  const logout = useLogout()

  useEffect(() => {
    const fetchAuthData = async () => {
      if (auth) {
        return
      }

      const applyTokenThenSetAuth = async (authData: AuthUser) => {
        try {
          await applyToken(authData.token)
          setAuth(authData)
        } catch (err: any) {
          logout()
          Toast.show({
            type: 'error',
            text1: 'Authentication failed, please try again.'
          })
        }
      }
      const authData = await AsyncStorage.getItem('auth')
      if (!authData) {
        NavigationService.navigate(SCREENS.LOGIN)
        return
      }
      const data = JSON.parse(authData)
      if (data && data.token && Date.now() - data.token.createdAt < 43200000) {
        applyTokenThenSetAuth(data as AuthUser)
      } else {
        AsyncStorage.removeItem('auth')
        NavigationService.navigate(SCREENS.LOGIN)
      }
    }
    fetchAuthData()
  }, [auth, logout, setAuth])

  return auth
}

export default useAuth
