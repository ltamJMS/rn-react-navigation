import React, { FC, useState, useEffect, useCallback } from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native'
import { styles } from './styles'
import { Avatar, IconButton } from 'react-native-paper'
import { MD3Colors } from 'react-native-paper'
import AgentStatus, { AgentStatusMap } from '../../services/models/softPhone'
import {
  getASText,
  getDisplayStatus,
  getStatusStyle
} from '../../services/agentStatus'
import { useRecoilState, useRecoilValue } from 'recoil'
import { contextsState, tenantState } from '../../services/store/tenant'
import Octicons from 'react-native-vector-icons/Octicons'
import { agentLoginState } from '../../services/store/softphone'
import DialogView from './DialogView'

interface Props {
  agents?: AgentStatusMap
}

const AgentList: FC<Props> = props => {
  const { agents } = props
  const tenant = useRecoilValue(tenantState)
  const [agentLoginStatus] = useRecoilState(agentLoginState)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AgentStatus | null>(null)
  const [sortOption, setSortOption] = useState<'内線番号' | '状態'>('状態')
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [selectedContextId, setSelectedContextId] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(true) // Added
  const [refreshing, setRefreshing] = useState(false)
  const contexts = useRecoilValue(contextsState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contextList = contexts
    ? Object.keys(contexts).map(key => ({
        id: key,
        dispName: contexts[key].dispName
      }))
    : []

  useEffect(() => {
    if (contextList.length > 0 && selectedContextId === null) {
      setSelectedItem(contextList[0].dispName)
      setSelectedContextId(contextList[0].id)
    }

    // Simulate network request or some data processing to fetch agents
    setTimeout(() => setLoading(false), 1000) // Simulates loading completion; remove this line if you're fetching data asynchronously
  }, [contextList, selectedContextId])

  if (!tenant) {
    return <Text> </Text>
  }

  // Filter agents based on the selected context
  let agentArray = Object.values(agents || {}).filter(
    agent =>
      agent.exten !== undefined &&
      agent.exten !== null &&
      agent.contextName === selectedContextId
  )

  const getStatusForSorting = (agent: AgentStatus) => {
    const statusText = getASText(
      agent.phoneStatus || 0,
      agent.status || 0,
      tenant
    )
    return statusText === 'ログオフ' ? 1 : 0
  }

  if (sortOption === '状態') {
    agentArray.sort((a, b) => {
      const aStatusSort = getStatusForSorting(a)
      const bStatusSort = getStatusForSorting(b)
      return aStatusSort - bStatusSort
    })
  } else if (sortOption === '内線番号') {
    agentArray.sort((a, b) => (Number(a.exten) || 0) - (Number(b.exten) || 0))
  }

  const toggleSortOption = () => {
    setSortOption(sortOption === '状態' ? '内線番号' : '状態')
  }

  const renderItem = ({ item }: { item: AgentStatus }) => {
    const dispStatus = getDisplayStatus(item.phoneStatus || 0, item.status || 0)
    const statusText = getASText(
      item.phoneStatus || 0,
      item.status || 0,
      tenant
    )
    const { color, callable } = getStatusStyle(dispStatus)

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Avatar.Icon
            size={30}
            icon="face-agent"
            color={MD3Colors.neutral20}
            style={styles.avatar}
          />
          <View>
            <Text numberOfLines={1}>{`${item.name}`}</Text>
            <Text style={{ marginTop: 4 }}>{item.exten}</Text>
          </View>
        </View>
        <View style={[styles.container, { marginRight: 4 }]}>
          <Text style={{ color }}>{statusText}</Text>
          <IconButton
            icon="phone"
            size={22}
            // style={styles.iconButton}
            iconColor={`${callable ? '#007AFF' : '#cfcfcf'}`}
            onPress={() => {
              setSelectedAgent(item)
              setDialogVisible(true)
            }}
            disabled={!callable}
          />
        </View>
      </View>
    )
  }

  const renderDropdown = () => {
    if (!dropdownVisible) return null

    return (
      <View style={styles.dropdown}>
        <FlatList
          data={contextList}
          renderItem={({ item }) => (
            <Pressable
              key={item.id}
              style={styles.modalButton}
              onPress={() => {
                setSelectedItem(item.dispName)
                setSelectedContextId(item.id)
                setDropdownVisible(false)
              }}
            >
              <Text style={styles.modalButtonText}>{item.dispName}</Text>
            </Pressable>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    )
  }
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  if (loading) {
    return (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    )
  }

  return (
    <>
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={styles.toggleButtonText}>
            {selectedItem || '所属グループ'}
          </Text>
          <Octicons name="chevron-down" size={16} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={toggleSortOption}>
          <Text style={styles.toggleButtonText}>
            {sortOption === '状態' ? '状態で表示' : '内線番号で表示'}
          </Text>
          <Octicons name="sort-asc" size={16} color="#333" />
        </TouchableOpacity>
      </View>

      {renderDropdown()}

      {agentArray.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image source={require('../../assets/images/nodata.png')} />
          <Text style={styles.noDataText}>データがありません</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
          data={agentArray}
          renderItem={renderItem}
          keyExtractor={item => item.userID.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl // Step 3: Add RefreshControl to FlatList
              refreshing={refreshing}
              onRefresh={onRefresh} // Step 4: Attach onRefresh function
            />
          }
        />
      )}

      {dialogVisible && selectedAgent && (
        <DialogView
          visible={dialogVisible}
          onDismiss={() => {
            setDialogVisible(false)
            setSelectedAgent(null)
          }}
          agentLoginStatus={agentLoginStatus}
          agent={selectedAgent}
        />
      )}
    </>
  )
}

export default AgentList
