import JsSIP, { UA } from 'jssip'
import { UAConfiguration } from 'jssip/lib/UA'

import { SipAccount } from '../types'

export const createUA = (sipAccount: SipAccount) => {
  const { sipAccount: account, sipPassword, domain } = sipAccount
  const port = 8089
  const url = `wss://${domain}:${port}/ws`
  const socket = new JsSIP.WebSocketInterface(url)
  const uaOption: UAConfiguration = {
    sockets: [socket],
    uri: `sip:${account}@${domain}`,
    password: sipPassword,
    register: true,
    contact_uri: `sip:${account}@${domain};transport=ws`,
    session_timers: false,
    session_timers_force_refresher: true,
    user_agent: 'InfiniTalk SoftPhone Ver1.0.0'
  }
  const ua = new UA(uaOption)

  return ua
}
