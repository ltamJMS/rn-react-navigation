import './i18n'
import './libs/firebase_config'

import { AppRegistry } from 'react-native'

import App from './App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
