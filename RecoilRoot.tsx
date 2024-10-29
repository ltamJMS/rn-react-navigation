import React from 'react'
import { RecoilRoot } from 'recoil'

import App from './App'

const AppFake = () => null

interface HeadlessCheckProps {
  isHeadless: boolean
}

const HeadlessCheck: React.FC<HeadlessCheckProps> = ({ isHeadless }) => {
  if (isHeadless) {
    return <AppFake />
  }
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )
}

export default HeadlessCheck
