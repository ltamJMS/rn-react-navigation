import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  SectionList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as NavigationService from 'react-navigation-helpers'
import { SCREENS } from '../shared/constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import useAuth from '../services/usecases/auth/useAuth'
import { useRecoilState } from 'recoil'
import { callHistoryData } from '../services/store/callHistory'
import { getCallHistory } from '../services/callHistory'

// Sample data based on your response
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomPhoneNumber() {
  return '0' + getRandomInt(300000000, 399999999) // Giả lập số điện thoại
}

function generateFakeCallData(numberOfEntries: number) {
  const callData = []

  for (let i = 0; i < numberOfEntries; i++) {
    const fakeDate = new Date(
      2024,
      getRandomInt(10, 11),
      getRandomInt(25, 28),
      getRandomInt(0, 23),
      getRandomInt(0, 59)
    ).toISOString()
    const fakeId = `${getRandomInt(1000, 9999)}.${getRandomInt(100, 999)}`

    callData.push({
      operator: {
        name: `Operator_${getRandomInt(100, 999)}`,
        phoneNumber: getRandomPhoneNumber()
      },
      record: {
        contact: {
          linkFile:
            'gs://text-service/099a/99/202412/stereo_mon/1735212963.59104-20241226-20:36:03-in.wav'
        },
        operator: {
          linkFile:
            'gs://text-service/099a/99/202412/stereo_mon/1735212963.59104-20241226-20:36:03-out.wav'
        }
      },
      text: {
        operator: {
          status: 0,
          improveStatus: 0
        },
        contact: {
          status: 0,
          improveStatus: 0
        }
      },
      _id: fakeId,
      id: fakeId,
      companyId: `${getRandomInt(1000, 9999)}`,
      startTime: fakeDate,
      type: getRandomInt(0, 1),
      contact: getRandomPhoneNumber(),
      talkDuration: getRandomInt(0, 60),
      ringDuration: getRandomInt(0, 20),
      forwardCalls: [],
      groupId: `${getRandomInt(10, 99)}`,
      stereoFile: `${fakeId}-${fakeDate.substring(0, 10)}`,
      wavUploaded: Math.random() < 0.5,
      __v: 0,
      createdAt: fakeDate,
      updatedAt: fakeDate
    })
  }

  return callData
}

const callData = generateFakeCallData(20)
// Function to group data by date
// Helper function to format dates
function formatDate(date: Date, currentYear: number) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  // If the year is the same as the current year, omit the year in the formatted date
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
  const [, setCallData] = useRecoilState(callHistoryData)

  const getCallData = useCallback(async () => {
    if (!auth) return
    const data = await getCallHistory()
    if (data.success) setCallData(data.data)
  }, [auth, setCallData])

  useEffect(() => {
    if (auth) getCallData()
  }, [auth, getCallData])

  const filteredCallData = callData.filter(item => {
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
            {/* <Image source={arrowImage} style={styles.arrow} /> */}
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
            onChangeText={text => setSearch(text)}
            value={search}
          />
        </View>
        <TouchableOpacity
          onPress={toggleModalVisibility}
          style={styles.filterButton}
        >
          <Text style={{}}>{filterOption}</Text>
          <FontAwesome
            name="caret-down"
            size={16}
            color="#333"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
      {/* just show section which has data */}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModalVisibility}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => selectOption('全て')}
              style={styles.modalOption}
            >
              <Text style={{}}>全て</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption('着信')}
              style={styles.modalOption}
            >
              <Text style={{}}>着信</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectOption('発信')}
              style={styles.modalOption}
            >
              <Text style={{}}>発信</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    borderColor: '#ddd'
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 50,
    marginLeft: 8
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 4
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
  // arrow: {
  //   width: 56,
  //   height: 35,
  //   marginHorizontal: 5
  // },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 100,
    right: 8
  },
  modalContent: {
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    marginLeft: 8
  },
  modalOption: {
    padding: 10,
    width: '100%'
  },
  arrowIcon: {
    marginLeft: 5
  }
})
