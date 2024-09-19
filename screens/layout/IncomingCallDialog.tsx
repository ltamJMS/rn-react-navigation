import React from 'react'
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface IncomingCallDialogProps {
  visible: boolean
  onAnswer: () => void
  onDecline: () => void
  phoneNumber: string
  onRequestClose: () => void
}

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
  visible,
  onAnswer,
  onDecline,
  phoneNumber,
  onRequestClose
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.titleContainer}>
            <Text style={styles.modalTitle}>Incoming call</Text>
          </View>
          <Text style={styles.modalPhoneNumber}>{phoneNumber}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onAnswer} style={styles.answerButton}>
              <Icon name="phone" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecline} style={styles.declineButton}>
              <Icon name="call-end" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalPhoneNumber: {
    fontSize: 16,
    marginBottom: 40
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  answerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  declineButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  }
})

export default IncomingCallDialog
