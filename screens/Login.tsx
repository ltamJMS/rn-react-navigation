import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Image, Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import { Button, Checkbox, FormControl, Input } from 'native-base'

import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'

import { useSetRecoilState } from 'recoil'
import { AuthUser } from '../services/models/account'
import { authState, sipAccountState } from '../services/store/auth'
import {
  applyToken,
  getSipAccount,
  loginByPassword
} from '../services/usecases/auth/auth'
import { HTTPError } from '../services/models/error'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState<boolean>(false)
  const [authRes, setAuthRes] = useState<AuthUser>()
  const setAuth = useSetRecoilState(authState)
  const setSipAccountData = useSetRecoilState(sipAccountState)
  const { control } = useForm()
  const characterMax = 90

  useEffect(() => {
    const getStoredCredentials = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem('loginRemember')
        if (storedCredentials) {
          const parsedCredentials = JSON.parse(storedCredentials)
          if (parsedCredentials.remember) {
            setUsername(parsedCredentials.username)
            setPassword(parsedCredentials.password)
            setRemember(parsedCredentials.remember)
          }
        }
      } catch (error) {}
    }

    getStoredCredentials()
  }, [])

  const handleLogin = useCallback(async () => {
    if (password.length < 1 || username.length < 1) {
      Toast.show({
        type: 'error',
        text1: 'アカウントやパスワードを入力してください'
      })
    } else {
      setIsLoading(true)
      try {
        const res = await loginByPassword(username, password)
        if (res instanceof HTTPError) {
          setIsLoading(false)
          switch (res.getCode()) {
            case 400:
              Toast.show({
                type: 'error',
                text1: 'アカウントまたはパスワードが間違っています'
              })
              break
            case 401:
              Toast.show({
                type: 'error',
                text1: 'アカウントまたはパスワードが間違っています'
              })
              break
            case 200:
              Toast.show({
                type: 'success',
                text1: 'ログインしました'
              })
              break
            case 404:
              Toast.show({
                type: 'error',
                text1: 'ログインできません'
              })
              break
            case 500:
              Toast.show({
                type: 'error',
                text1: 'サーバーに接続できません'
              })
              break
          }
          return
        }
        setAuthRes(res)
        const loginData = {
          username,
          password,
          remember
        }
        AsyncStorage.setItem('loginRemember', JSON.stringify(loginData))
        AsyncStorage.setItem('auth', JSON.stringify(res))
      } catch (error) {
        console.error('=====> LOGIN ERROR', error)
        Toast.show({
          type: 'error',
          text1: `${error}: login failed`
        })
        setIsLoading(false)
      }
    }
  }, [password, username, remember])

  useEffect(() => {
    if (authRes) {
      const applyTokenAsync = async () => {
        try {
          await applyToken(authRes.token)
          setIsLoading(false)
          setAuth(authRes)
          getSipAccount(authRes.username, authRes.customerID).then(result => {
            if (result.error) {
              let message = ''
              switch (result.message) {
                case 'SIP_ACCOUNT_NOT_FOUND':
                  message = 'ソフトフォンの設定が間違っています。'
                  break
                case 'COMPANY_NOT_FOUND':
                  message =
                    '管理者に連絡してください。(SIPACC_COMPANY_NOT_FOUND)'
                  break
                case 'SERVER_ERROR':
                  message = 'サーバーに接続できません'
                  break
                default:
                  message = 'サーバーに接続できません'
              }
              Toast.show({
                type: 'error',
                text1: message
              })
              return
            }

            setSipAccountData({
              sipAccount: result.data.account,
              sipPassword: result.data.password,
              sipType: result.data.sipType,
              agent: result.data.agent,
              transport: result.data.transport,
              domain: result.data.domain,
              asteriskDomain: result.data?.asteriskDomain
            })
          })
        } catch (err) {
          console.error('=====> AUTH ERROR', err)
        }
      }
      applyTokenAsync()
    }
  })

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            source={require('../assets/images/logoApp.png')}
            resizeMode="stretch"
            alt="logo"
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.textTitle}>SOFTPHONE</Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10
          }}
        >
          <View style={{ width: '84%', marginTop: 10 }}>
            <FormControl isRequired>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: 'Please input username'
                }}
                render={() => (
                  <View>
                    <Input
                      bgColor="#E6E3E6"
                      borderRadius="10"
                      borderWidth={0.5}
                      maxLength={characterMax}
                      w={{
                        base: '100%'
                        // md: '25%',
                      }}
                      InputLeftElement={
                        <Image
                          source={require('../assets/images/iconAccount.png')}
                          style={{ marginLeft: '6%', width: 14, height: 16 }}
                        />
                      }
                      style={{ color: '#000' }}
                      placeholder={'アカウント'}
                      placeholderTextColor={'dark.50'}
                      // autoFocus
                      onChangeText={text => setUsername(text)}
                      value={username}
                      autoCapitalize="none"
                    />
                    {username.length === characterMax && (
                      <View
                        style={{
                          marginVertical: 5,
                          marginLeft: 10
                        }}
                      >
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 10
                          }}
                        >
                          90文字以内で入力してください
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </FormControl>
          </View>
          <View style={{ width: '84%', margin: 10 }}>
            <FormControl minW="75%" isRequired>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Please input password'
                }}
                render={() => (
                  <View>
                    <Input
                      bgColor="#E6E3E6"
                      borderRadius="10"
                      borderWidth={0.5}
                      maxLength={characterMax}
                      w={{
                        base: '100%'
                        // md: '25%',
                      }}
                      type={'password'}
                      InputLeftElement={
                        <Image
                          source={require('../assets/images/iconPassword.png')}
                          style={{ marginLeft: '6%', width: 14.2, height: 16 }}
                        />
                      }
                      style={{ color: '#000' }}
                      placeholder={'パスワード'}
                      placeholderTextColor={'dark.50'}
                      // autoFocus
                      onChangeText={text => setPassword(text)}
                      value={password}
                      autoCapitalize="none"
                    />
                    {password.length === characterMax && (
                      <View
                        style={{
                          marginVertical: 5,
                          marginLeft: 10
                        }}
                      >
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 10
                          }}
                        >
                          90文字以内で入力してください
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </FormControl>
          </View>
          <View
            style={{
              width: '100%',
              height: 40,
              margin: 10,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <View>
              <Checkbox
                isChecked={remember}
                value={'1'}
                my="1"
                onChange={() => setRemember(!remember)}
                size="sm"
                variant="outline"
                style={{ borderWidth: 0.8 }}
              >
                <Text style={styles.textSmall}>パスワードを保存する</Text>
              </Checkbox>
            </View>
          </View>
          <View style={{ width: '84%' }}>
            <Button
              onPress={handleLogin}
              disabled={isLoading}
              style={{ backgroundColor: '#AACD06', borderRadius: 10 }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.text}>ログイン</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    justifyContent: 'center'
  },
  textTitle: {
    fontSize: 26,
    color: 'black',
    marginVertical: '2%'
  },
  text: {
    fontSize: 14,
    color: 'black',
    marginVertical: '4%'
  },
  textSmall: {
    fontSize: 13,
    color: 'black'
  }
})
