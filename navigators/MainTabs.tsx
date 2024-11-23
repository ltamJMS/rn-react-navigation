import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  BottomTabScreenProps,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'
import Home from '../screens/home'
import CallHistory from '../screens/call-history'
import Agents from '../screens/agents'

export type IconProps = {
  color: string
  size: number
}

export type MainTabsParamList = {
  Home: undefined
  CallHistory: undefined
  Agents: undefined
}

export type MainTabsProps = BottomTabScreenProps<MainTabsParamList>

const Tab = createBottomTabNavigator<MainTabsParamList>()

export default function MainTabs() {
  const userTabIcon = ({ color, size }: IconProps) => (
    <Icon name="home-variant-outline" color={color} size={size} />
  )

  const settingTabIcon = ({ color, size }: IconProps) => (
    <Icon name="cog-outline" color={color} size={size} />
  )

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: userTabIcon,
          tabBarBadge: 3,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name="CallHistory"
        component={CallHistory}
        options={{
          tabBarIcon: settingTabIcon,
          tabBarLabel: 'Call History'
        }}
      />

      <Tab.Screen
        name="Agents"
        component={Agents}
        options={{
          tabBarIcon: settingTabIcon,
          tabBarLabel: 'Agents'
        }}
      />
    </Tab.Navigator>
  )
}
