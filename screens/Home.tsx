import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import useBoundStore from '../stores'

export default function Home() {
  const { t } = useTranslation()
  const user = useBoundStore(state => state.user)
  const unAuthenticate = useBoundStore(state => state.unAuthenticate)
  const softPhone = useBoundStore(state => state.softPhone)

  const handleCall = () => {
    softPhone?.call('08032418093')
  }

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleCall}>
        Call
      </Button>

      <Text style={{ textAlign: 'center', fontSize: 20, color: 'red' }}>
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
