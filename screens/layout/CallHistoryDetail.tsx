import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

var Sound = require('react-native-sound')
Sound.setCategory('Playback')

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

const CallHistoryDetail: React.FC = ({ route }: any) => {
  const { callDetails } = route.params
  const [playing, setPlaying] = useState(false)
  const [audio, setAudio] = useState<typeof Sound | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const sound = new Sound(
      'https://storage.googleapis.com/softphone-mobile-dev/099a1_CS_202401_stereo_mon_1705279146.1724-20240115-09_39_06-in.wav',
      null,
      (error: any) => {
        if (error) {
          console.log('failed to load the sound', error)
          return
        }
        setDuration(sound.getDuration())
      }
    )

    sound.setVolume(1)
    setAudio(sound)

    const interval = setInterval(() => {
      if (sound.isPlaying()) {
        sound.getCurrentTime((seconds: number) => setCurrentTime(seconds))
      }
    }, 1000)

    return () => {
      sound.release()
      clearInterval(interval)
    }
  }, [])

  const playPause = () => {
    if (!audio) return

    if (audio.isPlaying()) {
      audio.pause()
      setPlaying(false)
    } else {
      setPlaying(true)
      audio.play((success: boolean) => {
        if (success) {
          setPlaying(false)
          console.log('successfully finished playing')
        } else {
          setPlaying(false)
          console.log('playback failed due to audio decoding errors')
        }
      })
    }
  }

  const skipForward = () => {
    if (audio) {
      audio.getCurrentTime((seconds: number) => {
        let newTime = seconds + 10
        if (newTime > duration) newTime = duration
        audio.setCurrentTime(newTime)
        setCurrentTime(newTime)
      })
    }
  }

  const skipBackward = () => {
    if (audio) {
      audio.getCurrentTime((seconds: number) => {
        let newTime = seconds - 10
        if (newTime < 0) newTime = 0
        audio.setCurrentTime(newTime)
        setCurrentTime(newTime)
      })
    }
  }

  const calTypeIcon =
    callDetails.type === 0 ? (
      <MaterialCommunityIcons
        name="arrow-bottom-left"
        size={16}
        color="#AACD05"
        style={{ height: 24, marginRight: 2 }}
      />
    ) : (
      <MaterialCommunityIcons
        name="arrow-top-right"
        size={16}
        color="#EC5079"
        style={{ height: 24, marginRight: 2 }}
      />
    )

  const calTypeText = callDetails.type === 0 ? '着信' : '発信'
  const textColor = callDetails.type === 0 ? '#AACD05' : '#EC5079'

  return (
    <View style={styles.container}>
      <View style={styles.audioPlayer}>
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onSlidingComplete={value => audio?.setCurrentTime(value)}
            minimumTrackTintColor="#4F8EF7"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4F8EF7"
            tapToSeek={true}
            thumbImage={require('../../assets/images/thumb.png')}
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.playBtn} onPress={skipBackward}>
            <Icon
              name="play-skip-back-circle-outline"
              size={28}
              color="#4F8EF7"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={playPause}>
            <Icon
              name={playing ? 'pause-circle-outline' : 'play-circle-outline'}
              size={44}
              color="#4F8EF7"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={skipForward}>
            <Icon
              name="play-skip-forward-circle-outline"
              size={28}
              color="#4F8EF7"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <View style={styles.detailsColumnLabels}>
            <Text style={styles.detailItem}>日付</Text>
            <Text style={styles.detailItem}>種別</Text>
            <Text style={styles.detailItem}>担当者</Text>
            <Text style={styles.detailItem}>電話番号</Text>
            <Text style={styles.detailItem}>通話先</Text>
            <Text style={styles.detailItem}>通話時間</Text>
            <Text style={styles.detailItem}>呼出時間</Text>
          </View>
          <View style={styles.detailsColumnValues}>
            <Text style={styles.detailValue}>
              {new Date(callDetails?.startTime).toLocaleString()}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {calTypeIcon}
              <Text style={[styles.detailValue, { color: textColor }]}>
                {calTypeText}
              </Text>
            </View>
            <Text style={styles.detailValue}>
              {callDetails?.operator?.name}
            </Text>
            <Text style={styles.detailValue}>
              {callDetails?.operator?.phoneNumber}
            </Text>
            <Text style={styles.detailValue}>{callDetails?.contact}</Text>
            <Text style={styles.detailValue}>
              {callDetails?.talkDuration} 秒
            </Text>
            <Text style={styles.detailValue}>
              {callDetails?.ringDuration} 秒
            </Text>
          </View>
        </View>
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
  audioPlayer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playBtn: {
    padding: 4
  },
  slider: {
    flex: 1,
    marginHorizontal: 5
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  detailsRow: {
    flexDirection: 'row'
  },
  detailsColumnLabels: {
    flex: 3, // Cột đầu chiếm 3 phần
    paddingHorizontal: 10
  },
  detailsColumnValues: {
    flex: 7, // Cột giá trị chiếm 7 phần
    paddingHorizontal: 10
  },
  detailItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8
  },
  timeText: {
    color: '#555',
    fontSize: 14
  }
})

export default CallHistoryDetail
