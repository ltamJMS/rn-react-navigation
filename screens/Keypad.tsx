import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { IconButton, MD3Colors } from 'react-native-paper'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../shared/constants'
import { useSoftPhone } from '../services/usecases/auth/useSoftPhone'

const Keypad = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const { handleCall } = useSoftPhone()
  const handlePress = (value: string) => {
    setPhoneNumber(prev => prev + value)
  }

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const handleCallClick = () => {
    if (phoneNumber) {
      console.log('Calling:', phoneNumber)
      handleCall(phoneNumber)
      // NavigationService.navigate(SCREENS.CALL_SCREEN)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.phoneNumberText} numberOfLines={2}>
          {phoneNumber}
        </Text>
        {phoneNumber.length > 0 && (
          <IconButton
            icon="backspace"
            iconColor={MD3Colors.neutralVariant70}
            size={24}
            onPress={handleDelete}
          />
        )}
      </View>

      <View style={styles.keypad}>
        {createKeypadRow(['1', '2', '3'], ['', 'ABC', 'DEF'], handlePress)}
        <Divider />
        {createKeypadRow(['4', '5', '6'], ['GHI', 'JKL', 'MNO'], handlePress)}
        <Divider />
        {createKeypadRow(['7', '8', '9'], ['PQRS', 'TUV', 'WXYZ'], handlePress)}
        <Divider />
        <View style={styles.keypadRow}>
          <TouchableOpacity
            onPress={() => handlePress('*')}
            style={styles.keypadButton}
          >
            <Fontisto name="asterisk" size={15} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('0')}
            onLongPress={() => handlePress('+')}
            style={styles.keypadButton}
          >
            <Text style={styles.buttonText}>0</Text>
            <Text style={styles.lettersText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('#')}
            style={styles.keypadButton}
          >
            <Fontisto name="hashtag" size={15} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleCallClick} style={styles.callButton}>
        <FontAwesome name="phone" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const createKeypadRow = (
  keys: string[],
  letters: string[],
  onPress: (val: string) => void
) => (
  <View style={styles.keypadRow}>
    {keys.map((key, index) => (
      <TouchableOpacity
        key={key}
        onPress={() => onPress(key)}
        style={styles.keypadButton}
      >
        <Text style={styles.buttonText}>{key}</Text>
        <Text style={styles.lettersText}>{letters[index]}</Text>
      </TouchableOpacity>
    ))}
  </View>
)

const Divider = () => <View style={styles.divider} />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
    width: '92%',
    height: 100
  },
  phoneNumberText: {
    fontSize: 32,
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10,
    textAlign: 'center'
  },
  keypad: {
    width: '92%'
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
    // marginBottom: 8
  },
  keypadButton: {
    width: '33%',
    padding: 14,
    alignItems: 'center',
    // backgroundColor: '#ddd',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 32
  },
  lettersText: {
    fontSize: 12,
    color: '#555'
  },
  divider: {
    height: 0.5,
    backgroundColor: '#bbb',
    marginVertical: 1
  },
  callButton: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: '#8CC835',
    borderRadius: 5,
    marginBottom: 30,
    alignItems: 'center'
  }
})

export default Keypad
