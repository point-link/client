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

export interface Client {
  uid: number
  ipv4: string | null
  ipv6: string | null
  port: number | null
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
  family: 4 | 6
}

export interface NetworkInterface {
  name: string
  information: NetworkInterfaceInfo[]
}

export interface FriendLoginWsInData {
  type: 'friend-login'
  uid: number
  ipv4: string | null
  ipv6: string | null
  port: number | null
}

export interface FriendLogoutWsInData {
  type: 'friend-logout'
  uid: number
}

export type WsInData = FriendLoginWsInData | FriendLogoutWsInData

export interface TextMessage {
  type: 'text'
  from: number
  to: number
  data: string
}

export interface ImageMessage {
  type: 'image'
  from: number
  to: number
  mime: string
  width: number
  height: number
  name: string
  size: number
  data: Uint8Array
  localPath?: string
}

export interface FileMessage {
  type: 'file'
  from: number
  to: number
  name: string
  size: number
  localPath?: string
}

export type Message = TextMessage | ImageMessage | FileMessage
