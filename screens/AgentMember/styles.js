import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  separator: {
    height: 0.5,
    backgroundColor: '#d0d7de',
    marginHorizontal: 16
  },
  avatar: {
    backgroundColor: '#d0d7de',
    alignSelf: 'center',
    margin: 16
  },
  iconButton: {
    alignSelf: 'flex-end',
    margin: 16
  },
  listItem: {
    paddingRight: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  icon: {
    marginLeft: 14,
    marginRight: 4
  }
})
