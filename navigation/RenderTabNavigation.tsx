import React from 'react'
import { Image, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

// ? Screens
import HomeScreen from '../screens/HomeScreen'
import CallHistory from '../screens/CallHistory'
import AgentMemberScreen from '../screens/AgentMember/AgentMemberScreen'
import { SCREENS } from '../shared/constants'
import { palette } from '../shared/theme/themes'

const Tab = createBottomTabNavigator()

const CustomHeaderTitle = (title: string) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text
      numberOfLines={1}
      style={{
        fontSize: 18,
        color: 'white'
      }}
    >
      {title}
    </Text>
  </View>
)

const RenderTabNavigation = () => {
  const renderTabIcon = (route: any, focused: boolean) => {
    let iconName
    switch (route.name) {
      case `${SCREENS.HOME}_TAB`:
        iconName = focused ? 'apps' : 'apps'
        break
      case `${SCREENS.CALL_HISTORY}_TAB`:
        iconName = focused ? 'time' : 'time'
        break
      case `${SCREENS.AGENT_MEMBER}_TAB`:
        iconName = focused ? 'people' : 'people'
        break
      default:
        iconName = focused ? 'apps' : 'apps'
        break
    }
    return (
      <Ionicons
        name={iconName}
        size={20}
        color={focused ? palette.borderColorDark : '#bababa'}
      />
    )
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#AACD06'
        },
        headerTitle: () => CustomHeaderTitle(route.name.replace('_TAB', '')),
        tabBarIcon: ({ focused }) => renderTabIcon(route, focused),
        tabBarActiveTintColor: palette.infinitalk,
        tabBarInactiveTintColor: '#bababa',
        tabBarStyle: {
          backgroundColor: palette.white
        },
        tabBarLabel: () => null
      })}
    >
      <Tab.Screen name={`${SCREENS.HOME}_TAB`} component={HomeScreen} />
      <Tab.Screen
        name={`${SCREENS.AGENT_MEMBER}_TAB`}
        component={AgentMemberScreen}
      />
      <Tab.Screen
        name={`${SCREENS.CALL_HISTORY}_TAB`}
        component={CallHistory}
      />
    </Tab.Navigator>
  )
}

export default RenderTabNavigation
