import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import AgentStatus from '../../services/models/softPhone'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  getASText,
  getDisplayStatus,
  getStatusStyle
} from '../../services/agentStatus'
import { useRecoilValue } from 'recoil'
import { tenantState } from '../../services/store/tenant'
import { CollapsableTest } from '../AgentMember/CollapsableTest'

interface TransferModalProps {
  visible: boolean
  onClose: () => void
  agents: AgentStatus[]
  onTransfer: (exten: string) => void
  onCall: (exten: string) => void
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  onClose,
  agents,
  onTransfer,
  onCall
}) => {
  const tenant = useRecoilValue(tenantState)
  const [expandedExten, setExpandedExten] = useState<string | null>(null)

  if (!tenant) {
    return <Text> </Text>
  }

  const toggleExpansion = (exten: string | null) => {
    setExpandedExten(exten === expandedExten ? null : exten)
  }

  const renderAgentItem = ({ item }: { item: AgentStatus }) => {
    const dispStatus = getDisplayStatus(item.phoneStatus || 0, item.status || 0)
    const statusText = getASText(
      item.phoneStatus || 0,
      item.status || 0,
      tenant
    )
    const { color, icon, size, callable } = getStatusStyle(dispStatus)
    const isExpanded = item.exten === expandedExten

    return (
      <View style={styles.agentItem}>
        <TouchableOpacity
          onPress={() => toggleExpansion(item.exten ?? null)}
          style={styles.touchableArea}
        >
          <Text style={styles.agentName}>{item.name}</Text>
          <View style={styles.descriptionContainer}>
            <Text>{item.exten}</Text>
            <Icon name={icon} color={color} style={styles.icon} size={size} />
            <Text style={{ color }} numberOfLines={2}>
              {statusText}
            </Text>
          </View>
        </TouchableOpacity>
        <CollapsableTest expanded={isExpanded}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                callable ? {} : { backgroundColor: '#606060' }
              ]}
              onPress={() => item.exten && onCall(item.exten)}
            >
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                callable ? {} : { backgroundColor: '#606060' }
              ]}
              onPress={() => item.exten && onTransfer(item.exten)}
            >
              <Text style={styles.buttonText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </CollapsableTest>
      </View>
    )
  }

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
    height: '70%',
    padding: 20
  },
  agentItem: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#ccc'
  },
  agentName: {
    fontSize: 16
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#007BFF'
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  icon: {
    marginLeft: 14,
    marginRight: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 6,
    width: 80,
    alignItems: 'center',
    borderRadius: 2
  },
  buttonText: {
    color: '#fff'
  },
  touchableArea: {
    paddingVertical: 12,
    paddingHorizontal: 6
  }
})

export default TransferModal
