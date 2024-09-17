import { HStack, StatusBar } from 'native-base'
import React from 'react'

export default function AppBar({
  LeftComponent = () => <></>,
  RightComponent = () => <></>,
  CenterComponent = () => <></>
}) {
  return (
    <>
      <StatusBar backgroundColor={'#AACD06'} barStyle="light-content" />

      <HStack
        bg={'#AACD06'}
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        minW="100%"
      >
        <LeftComponent />
        <CenterComponent />
        <RightComponent />
      </HStack>
    </>
  )
}
