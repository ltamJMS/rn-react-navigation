import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Keypad = () => {
  const [phoneNumber, setPhoneNumber] = useState('')

  const handlePress = (value: string) => {
    setPhoneNumber(prev => prev + value)
  }

  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (phoneNumber) {
      console.log('Calling', phoneNumber)
    }
  }

  return (
    <View style={styles.container}>
      {/* Phone Number Display */}
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.phoneNumberText} numberOfLines={2}>
          {phoneNumber}
        </Text>
        {phoneNumber.length > 0 && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {createKeypadRow(['1', '2', '3'], ['', 'ABC', 'DEF'], handlePress)}
        <Divider />
        {createKeypadRow(['4', '5', '6'], ['GHI', 'JKL', 'MNO'], handlePress)}
        <Divider />
        {createKeypadRow(['7', '8', '9'], ['PQRS', 'TUV', 'WXYZ'], handlePress)}
        <Divider />
        {createKeypadRow(['*', '0', '#'], ['', '+', ''], handlePress)}
      </View>

      {/* Call Button */}
      <TouchableOpacity onPress={handleCall} style={styles.callButton}>
        <Text style={styles.callText}>Call</Text>
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
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#ccc',
    borderRadius: 5
  },
  deleteText: {
    fontSize: 16,
    color: '#fff'
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
    paddingVertical: 10,
    backgroundColor: '#8CC835',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center'
  },
  callText: {
    fontSize: 18,
    color: '#fff'
  }
})

export default Keypad
