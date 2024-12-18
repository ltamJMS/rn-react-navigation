import { AppRegistry } from 'react-native'

import App from './App'
import { name as appName } from './app.json'

import '_i18n'

AppRegistry.registerComponent(appName, () => App)
