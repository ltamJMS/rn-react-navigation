import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type AuthStacksParamList = {
  Login: undefined
}
export type AuthStacksProps = NativeStackScreenProps<AuthStacksParamList>

export type MainTabsParamList = {
  Home: undefined
  Setting: undefined
}

export type MainTabsProps = BottomTabScreenProps<MainTabsParamList>
