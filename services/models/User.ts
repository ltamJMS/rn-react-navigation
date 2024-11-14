import AgentStatus from './softPhone'

/**
 * User is man that can login this app
 */
interface User {
  name: string
  username: string
  infinitalkCustomerId: string
  customerID: string
  agentStatus?: AgentStatus
  publicAvatarUrl?: string
}

export default User
