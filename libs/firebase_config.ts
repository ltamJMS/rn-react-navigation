import firebase from '@react-native-firebase/app'

const firebaseProConfig = {
  apiKey: 'AIzaSyBg3MMVPmKU1cvcP_3vcklTnHb6LWhPDoY',
  authDomain: 'commercial-001.firebaseapp.com',
  databaseURL: 'https://commercial-001.firebaseio.com',
  projectId: 'commercial-001',
  storageBucket: 'commercial-001.appspot.com',
  messagingSenderId: '552887512270',
  appId: '1:552887512270:android:27945947756f5f0791b49f'
}

!firebase.apps.length
  ? firebase.initializeApp(firebaseProConfig)
  : firebase.app()
