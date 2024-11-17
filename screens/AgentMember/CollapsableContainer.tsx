import React, { useState } from 'react'
import { LayoutChangeEvent, View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

export const CollapsableContainer = ({
  children,
  expanded
}: {
  children: React.ReactNode
  expanded: boolean
}) => {
  const [height, setHeight] = useState(0)
  const animatedHeight = useSharedValue(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight)
    }
  }

  const collapsableStyle = useAnimatedStyle(() => {
    animatedHeight.value = expanded ? withTiming(height) : withTiming(0)

    return {
      height: animatedHeight.value
    }
  }, [expanded, height])

  return (
    <Animated.View style={[collapsableStyle, { overflow: 'hidden' }]}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: '#FFF',
          width: '100%',
          marginRight: 16,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#E7E7E7',
          shadowColor: '#A2A2A2',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 4,
          marginBottom: 4
        }}
        onLayout={onLayout}
      >
        {children}
      </View>
    </Animated.View>
  )
}
