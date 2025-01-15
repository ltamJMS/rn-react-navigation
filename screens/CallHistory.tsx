/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  SectionList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../shared/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import useAuth from '../services/usecases/auth/useAuth'
import { useRecoilState } from 'recoil'
import { callHistoryData } from '../services/store/callHistory'
import { getCallHistory } from '../services/callHistory'
import Toast from 'react-native-toast-message'

function formatDate(date: Date, currentYear: number) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return year === currentYear ? `${month}/${day}` : `${year}/${month}/${day}`
}

const groupDataByDate = (data: any[]) => {
  const groupedData = data.reduce((groups: { [key: string]: any[] }, item) => {
    const date = new Date(item.startTime)
    const [formattedDate] = date.toISOString().split('T') // Format: YYYY-MM-DD
    if (!groups[formattedDate]) {
      groups[formattedDate] = []
    }
    groups[formattedDate].push(item)
    return groups
  }, {})

  const currentYear = new Date().getFullYear()

  return Object.keys(groupedData)
    .filter(date => groupedData[date].length > 0) // Filter out empty sections
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(date => {
      const dateObj = new Date(date)
      const title = formatDate(dateObj, currentYear)
      return { title, data: groupedData[date] }
    })
}

export default function CallHistory() {
  const auth = useAuth()
  const [search, setSearch] = useState('')
  const [filterOption, setFilterOption] = useState('全て')
  const [modalVisible, setModalVisible] = useState(false)
  const [callHistory, setCallData] = useRecoilState(callHistoryData)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const getCallData = useCallback(async () => {
    if (!auth) return
    setLoading(true)

    const token = auth?.token?.accessToken || ''
    let attempts = 0
    const maxRetries = 3
    let success = false

    while (attempts < maxRetries && !success) {
      attempts += 1
      const res = await getCallHistory(token, search)

      if (res.success && Array.isArray(res.data.data.edges)) {
        setCallData(res.data.data.edges)
        success = true
      } else {
        // If this is the last attempt, show error
        if (attempts === maxRetries) {
          setCallData([])
          Toast.show({
            type: 'error',
            text1: 'エラー',
            text2: '通話履歴の取得に失敗しました'
          })
        }
      }
    }

    setLoading(false)
  }, [auth, setCallData, search])

  useEffect(() => {
    if (auth) getCallData()
  }, [auth, getCallData])

  const onRefresh = () => {
    setRefreshing(true)
    getCallData().then(() => {
      setRefreshing(false)
    })
  }

  const handleSearchInputChange = (text: string) => {
    setSearch(text)
  }

  const filteredCallData = (callHistory || []).filter(item => {
    if (filterOption === '全て') return true
    if (filterOption === '着信') return item.type === 0
    if (filterOption === '発信') return item.type === 1
    return false
  })

  const sections = groupDataByDate(filteredCallData)

  const toggleModalVisibility = () => {
    setModalVisible(!modalVisible)
  }

  const selectOption = (option: string) => {
    setFilterOption(option)
    toggleModalVisibility()
  }

  const navigateToDetail = (item: any) => {
    NavigationService.push(SCREENS.CALL_HISTORY_DETAIL, { callDetails: item })
  }

  const renderItem = ({ item }: { item: any }) => {
    if (
      filterOption !== '全て' &&
      ((filterOption === '着信' && item.type !== 0) ||
        (filterOption === '発信' && item.type !== 1))
    ) {
      return null
    }

    const calTypeIconPrefix =
      item.type === 0 ? (
        <MaterialCommunityIcons
          name="arrow-left"
          size={12}
          color="#AACD05"
          style={{ height: 24, marginTop: 12, marginLeft: 6 }}
        />
      ) : (
        <MaterialCommunityIcons
          name="minus"
          size={12}
          color="#EC5079"
          style={{ height: 24, marginTop: 12, marginLeft: 6 }}
        />
      )

    const calTypeIconSuffix =
      item.type === 0 ? (
        <MaterialCommunityIcons
          name="minus"
          size={12}
          color="#AACD05"
          style={{ height: 24, marginTop: 12, marginRight: 6 }}
        />
      ) : (
        <MaterialCommunityIcons
          name="arrow-right"
          size={12}
          color="#EC5079"
          style={{ height: 24, marginTop: 12, marginRight: 6 }}
        />
      )

    const calTypeText = item.type === 0 ? '着信' : '発信'
    const textColor = item.type === 0 ? '#AACD05' : '#EC5079'
    const formattedTime = new Date(item.startTime).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigateToDetail(item)}
      >
        <Image
          source={require('../assets/images/iconMiniLogo.png')}
          style={styles.logoAvatar}
        />

        <View style={styles.content}>
          <Text style={{}}>{item.operator.name}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>{item.operator.phoneNumber}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {calTypeIconPrefix}
              <Text style={[styles.detailValue, { color: textColor }]}>
                {calTypeText}
              </Text>
              {calTypeIconSuffix}
            </View>
            <Text style={styles.details}>{item.contact}</Text>
          </View>
        </View>

        <Text style={styles.time}>{formattedTime}</Text>
      </TouchableOpacity>
    )
  }

  const renderSectionHeader = ({
    section: { title }
  }: {
    section: { title: string }
  }) => <Text style={styles.sectionHeader}>{title}</Text>

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <AntDesign
            name="search1"
            size={18}
            color="#DEDEDE"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.search}
            placeholder="名前・電話番号で検索"
            onChangeText={handleSearchInputChange}
            value={search}
          />
        </View>
        <TouchableOpacity
          onPress={toggleModalVisibility}
          style={styles.filterButton}
        >
          <Text style={{}}>{filterOption}</Text>
          <FontAwesomeIcon
            name="caret-down"
            size={16}
            color="#333"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image source={require('../assets/images/nodata.png')} />
          <Text style={styles.noDataText}>データがありません</Text>
        </View>
      ) : (
        <SectionList
          sections={sections} // Đảm bảo sections có dữ liệu hợp lệ
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={'#fff'}
            />
          }
        />
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModalVisibility}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={toggleModalVisibility}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => selectOption('全て')}
              style={styles.modalOption}
            >
              <Text style={styles.optionText}>全て</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption('着信')}
              style={styles.modalOption}
            >
              <Text style={styles.optionText}>着信</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption('発信')}
              style={styles.modalOption}
            >
              <Text style={styles.optionText}>発信</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  search: {
    height: 40,
    borderColor: '#ddd',
    width: '95%'
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderRadius: 50,
    marginLeft: 8
  },
  searchIcon: {
    marginRight: 8
  },
  filterButton: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.4,
    width: '100%'
  },
  content: {
    flex: 1
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailValue: {
    fontSize: 12,
    color: '#333'
  },
  logoAvatar: {
    width: 22,
    height: 22,
    marginRight: 10
  },
  details: {
    color: '#555'
  },
  time: {
    color: '#888'
  },
  sectionHeader: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  modalBackground: {
    flex: 1,
    alignItems: 'flex-end'
    // right: 10
    // backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 100,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 4,
    marginTop: 110,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  modalOption: {
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd'
  },
  optionText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16
  },
  arrowIcon: {
    marginLeft: 5
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataText: {
    fontSize: 16,
    color: '#888'
  },
  loadingContainer: {
    flex: 1
  }
})
