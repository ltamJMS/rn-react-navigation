import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import useBoundStore from '../stores'

export default function Home() {
  const { t } = useTranslation()
  const user = useBoundStore(state => state.user)
  const unAuthenticate = useBoundStore(state => state.unAuthenticate)

  return (
    <View className="flex-1 justify-center gap-y-6" style={styles.container}>
      <Text className="text-2xl text-center text-red-600">
        {t('common.hello', { name: user?.name })}👋
      </Text>

      <Button mode="contained" onPress={unAuthenticate}>
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
