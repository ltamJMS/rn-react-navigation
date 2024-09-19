import React from 'react'
import { Image, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// ? Screens
import HomeScreen from '../screens/HomeScreen'
import CallHistory from '../screens/CallHistory'
import ContactList from '../screens/ContactList'
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
        iconName = focused ? 'home' : 'home-outline'
        break
      case `${SCREENS.CALL_HISTORY}_TAB`:
        iconName = focused ? 'history' : 'history'
        break
      case `${SCREENS.CONTACT_LIST}_TAB`:
        iconName = focused ? 'account' : 'account-outline'
        break
      default:
        iconName = focused ? 'home' : 'home-outline'
        break
    }
    return (
      <MaterialCommunityIcons
        name={iconName}
        size={26}
        color={focused ? palette.borderColorDark : 'gray'}
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
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: palette.white
        },
        tabBarLabel: () => null
      })}
    >
      <Tab.Screen name={`${SCREENS.HOME}_TAB`} component={HomeScreen} />
      <Tab.Screen
        name={`${SCREENS.CALL_HISTORY}_TAB`}
        component={CallHistory}
      />
      <Tab.Screen
        name={`${SCREENS.CONTACT_LIST}_TAB`}
        component={ContactList}
      />
    </Tab.Navigator>
  )
}

export default RenderTabNavigation
