import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
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
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  smallButton: {
    borderRadius: 5,
    alignSelf: 'flex-start',
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  toggleButtonText: {
    color: '#333',
    marginRight: 8
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
    top: 130,
    left: 10
  },
  modalButton: {
    padding: 10,
    alignItems: 'flex-start'
  },
  modalButtonText: {
    fontSize: 14,
    color: '#000'
  },
  loadingIndicator: {
    flex: 1
  },
  noDataText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 4
  },
  noDataContainer: {
    flex: 1,
    marginTop: 60,
    alignItems: 'center',
    width: '100%'
  }
})
