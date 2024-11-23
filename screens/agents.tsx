import { FlatList, View } from 'react-native'
import { Card } from 'react-native-paper'
import useBoundStore from '../stores'

export default function Agents() {
  const agents = useBoundStore(state => state.agents)

  return (
    <FlatList
      data={agents}
      keyExtractor={item => `${item.userID}`}
      ItemSeparatorComponent={() => <View className="!h-5" />}
      contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 10 }}
      renderItem={({ item }) => (
        <Card>
          <Card.Title title={item.name} subtitle={item.exten} />
        </Card>
      )}
    />
  )
}
