import { View, Text, StyleSheet } from 'react-native'
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
  // const unAuthenticate = useBoundStore(state => state.unAuthenticate)

  const { data } = useQuery<User>({
    queryKey: ['users/2'],
    enabled: false
  })

  const handleLogout = () => {
    // unAuthenticate()
    queryClient.setQueryData(['users/2'], null)
    queryClient.removeQueries()
  }

  return (
    <View className="flex-1 justify-center gap-y-6" style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    justifyContent: 'center'
  }
})
