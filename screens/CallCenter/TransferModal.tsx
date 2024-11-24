import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native'
import AgentStatus from '../../services/models/softPhone'

interface TransferModalProps {
  visible: boolean
  onClose: () => void
  agents: AgentStatus[]
  onTransfer: (exten: string) => void
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  onClose,
  agents,
  onTransfer
}) => {
  const renderAgentItem = ({ item }: { item: AgentStatus }) => (
    <TouchableOpacity
      onPress={() => item.exten && onTransfer(item.exten)}
      style={styles.agentItem}
    >
      <Text style={styles.agentName}>{item.name}</Text>
      <Text style={styles.agentExten}>{item.exten}</Text>
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={agents}
            renderItem={renderAgentItem}
            keyExtractor={item => (item.exten ? item.exten.toString() : '')}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Hủy</Text>
          </TouchableOpacity>
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    padding: 20
  },
  agentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  agentName: {
    fontSize: 16
  },
  agentExten: {
    fontSize: 14,
    color: 'gray'
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#007BFF'
  }
})

export default TransferModal
