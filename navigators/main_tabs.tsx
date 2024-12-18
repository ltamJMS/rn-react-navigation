import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from '_screens/Home'
import Setting from '_screens/Setting'
import { IconProps } from '_types'
import { MainTabsParamList } from '_types/navigators'

const Tab = createBottomTabNavigator<MainTabsParamList>()

export default function MainTabs() {
  const userTabIcon = ({ color, size }: IconProps) => (
    <Icon name='home-variant-outline' color={color} size={size} />
  )

  const settingTabIcon = ({ color, size }: IconProps) => (
    <Icon name='cog-outline' color={color} size={size} />
  )

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: userTabIcon,
          tabBarBadge: 3,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name='Setting'
        component={Setting}
        options={{
          tabBarIcon: settingTabIcon,
          tabBarLabel: 'Setting'
        }}
      />
    </Tab.Navigator>
  )
}
