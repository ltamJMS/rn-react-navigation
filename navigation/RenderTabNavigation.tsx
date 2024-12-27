import React from 'react'
import { Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Screens
import CallHistory from '../screens/CallHistory'
import Keypad from '../screens/Keypad'
import AgentMemberScreen from '../screens/AgentMember/AgentMemberScreen'
import { SCREENS } from '../shared/constants'
import { palette } from '../shared/theme/themes'

type ScreenRoute = keyof typeof SCREENS

const Tab = createBottomTabNavigator()

const CustomHeaderTitle = ({ title }: { title: string }) => (
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
  const renderTabIcon = (route: ScreenRoute, focused: boolean) => {
    let iconName: string
    switch (route) {
      case `${SCREENS.CALL_HISTORY}_TAB`:
        iconName = 'time-sharp'
        break
      case `${SCREENS.KEYPAD}_TAB`:
        iconName = 'apps'
        break
      case `${SCREENS.AGENT_MEMBER}_TAB`:
        iconName = 'people'
        break
      default:
        iconName = 'apps'
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
        // eslint-disable-next-line react/no-unstable-nested-components
        headerTitle: () => (
          <CustomHeaderTitle title={route.name.replace('_TAB', '')} />
        ),
        tabBarIcon: ({ focused }) =>
          renderTabIcon(route.name as ScreenRoute, focused),
        tabBarActiveTintColor: palette.infinitalk,
        tabBarInactiveTintColor: '#bababa',
        tabBarStyle: {
          backgroundColor: palette.white
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              color: focused ? palette.borderColorDark : '#bababa',
              fontSize: 12,
              marginBottom: 5
            }}
          >
            {route.name.replace('_TAB', '')}
          </Text>
        )
      })}
    >
      <Tab.Screen
        name={`${SCREENS.AGENT_MEMBER}_TAB`}
        component={AgentMemberScreen}
      />
      <Tab.Screen name={`${SCREENS.KEYPAD}_TAB`} component={Keypad} />
      <Tab.Screen
        name={`${SCREENS.CALL_HISTORY}_TAB`}
        component={CallHistory}
      />
    </Tab.Navigator>
  )
}

export default RenderTabNavigation
