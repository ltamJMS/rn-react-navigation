import RNFS from 'react-native-fs'
import storage from '@react-native-firebase/storage'
import Toast from 'react-native-toast-message'
import auth from '@react-native-firebase/auth'
import JsSIP from 'jssip'
import { stringify } from 'flatted'

// Kích hoạt chế độ debug cho JsSIP
JsSIP.debug.enable('JsSIP:*')

const logFilePath = `${RNFS.DocumentDirectoryPath}/consoleLogs.log`

const logToFile = (method: string, ...args: any[]) => {
  const logString = args
    .map(arg => (typeof arg === 'object' ? stringify(arg) : arg))
    .join(' ')
  const timestamp = new Date().toISOString()
  const logWithTimestamp = `${timestamp} - ${method}: ${logString}\n`

  RNFS.appendFile(logFilePath, logWithTimestamp, 'utf8').catch(err => {
    console.error('Error saving log', err)
  })
}

// Ghi đè các phương thức console để log vào file
;(['log', 'debug', 'info', 'warn', 'error'] as const).forEach(method => {
  const originalMethod = console[method as keyof Console]
  console[method] = (...args: any[]) => {
    ;(originalMethod as Function).apply(console, args)
    logToFile(method.toUpperCase(), ...args)
  }
})

export async function uploadLogFile(customerId: any) {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-')
    const [dateSegment] = timestamp.split('T')

    const storagePath = `/Log/SoftphoneDebug/${customerId}/${dateSegment}/RegisterLog/consoleLogs_${timestamp}.log`

    // Kiểm tra người dùng đã xác thực
    const user = auth().currentUser
    if (!user) {
      throw new Error('User is not authenticated')
    }

    // Kiểm tra kích thước file
    const fileStat = await RNFS.stat(logFilePath)
    if (fileStat.size > 1 * 1024 * 1024) {
      throw new Error('File size exceeds 1 MB limit.')
    }

    // Upload file lên Firebase Storage
    await storage().ref(storagePath).putFile(logFilePath)
    Toast.show({
      type: 'success',
      text1: 'UPLOAD LOG FILE SUCCESS'
    })

    // Xóa file địa phương sau khi upload thành công
    await RNFS.unlink(logFilePath)
    console.log('Log file deleted from local storage.')
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'UPLOAD LOG FILE ERROR'
    })
    console.error('Error uploading log file:', error)
  }
}

export { logFilePath }
