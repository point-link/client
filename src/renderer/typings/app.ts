export interface Profile {
  avatar?: string
  nickname?: string
}

export interface Account {
  uid: number
  username: string
  profile: Profile
}

export interface Friend {
  uid: number
  tags: string[]
  remark?: string
  description?: string
  username: string
  profile: Profile
}

/**
 * 好友请求的状态。
 * 1：等待，
 * 2：取消，
 * 3：同意，
 * 4：拒绝。
 */
export type FriendRequestStatus = 1 | 2 | 3 | 4

export interface FriendRequest {
  requester: Account
  target: Account
  status: FriendRequestStatus
  description?: string
}

export interface NetworkInterfaceInfo {
  address: string
  family: 'IPv4' | 'IPv6'
}

export interface NetworkInterface {
  name: string
  information: NetworkInterfaceInfo[]
}
