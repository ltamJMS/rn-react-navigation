import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Sound from 'react-native-sound'
Sound.setCategory('Playback')
const CallHistoryDetail: React.FC = ({ route }: any) => {
  const { callDetails } = route.params

  const arrowImage =
    callDetails.type === 0
      ? require('../../assets/images/incomingCallArrow.png')
      : require('../../assets/images/outgoingCallArrow.png')

  return (
    <View style={styles.container}>
      {/* Audio Controls */}
      <View style={styles.audio}>
        <View style={styles.audioControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>{'>>'}</Text>
          </TouchableOpacity>
        </View>
        {/* Audio Indicator */}
        <View style={styles.indicatorContainer}>
          <Text style={styles.indicatorText}>0:00 / 3:00</Text>
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.details}>{callDetails.operator.phoneNumber}</Text>
        <Image source={arrowImage} style={styles.arrow} />
        <Text style={styles.details}>{callDetails.contact}</Text>
      </View>
      <View>
        <Text style={styles.detailItem}>
          担当者: {callDetails.operator.name}
        </Text>
        <Text style={styles.detailItem}>
          通話時間: {callDetails.talkDuration} 秒
        </Text>
        <Text style={styles.detailItem}>
          呼出時間: {callDetails.ringDuration} 秒
        </Text>
        <Text style={styles.detailItem}>
          開始時間: {new Date(callDetails.startTime).toLocaleString()}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  arrow: {
    width: 56,
    height: 35,
    marginHorizontal: 5
  },
  details: {
    color: '#555',
    fontSize: 16
  },
  detailItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#eee'
  },
  audio: {
    backgroundColor: '#eee'
  },
  controlButton: {
    marginHorizontal: 15,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5
  },
  controlText: {
    fontSize: 16,
    color: '#333'
  },
  indicatorContainer: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#eee'
  },
  indicatorText: {
    fontSize: 14,
    color: '#888'
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 5
  },
  progress: {
    width: '30%', // Example indicator
    height: '100%',
    backgroundColor: '#76c7c0',
    borderRadius: 5
  }
})

export default CallHistoryDetail
