import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { MainTabsProps } from '../navigators/tabs/MainTabs'
import { useQueryClient } from '@tanstack/react-query'
import useBoundStore from '../store'
import { User } from '../types'
import { useQuery } from '../hooks/useQuery'
import { useTranslation } from 'react-i18next'

export default function Home({ navigation }: MainTabsProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const unAuthenticate = useBoundStore(state => state.unAuthenticate)

  const { data } = useQuery<User>({
    queryKey: ['users/2'],
    refetchOnMount: false
  })
  console.log('first', queryClient)
  const handleLogout = () => {
    unAuthenticate()
    // queryClient.removeQueries()
  }

  return (
    <View>
      <Text className="text-2xl text-center text-red-600">
        {t('common.hello', { name: data?.name })}👋
      </Text>
      <Button onPress={() => navigation.navigate('Setting')} mode="outlined">
        Go to Explore
      </Button>
      <Button mode="contained" onPress={handleLogout}>
        Logout
      </Button>
    </View>
  )
}
