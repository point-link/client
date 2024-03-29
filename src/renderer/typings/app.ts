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

export type WsInData = {
  type: 'friend-login'
  uid: number
  ipv4: string | null
  ipv6: string | null
  port: number | null
} | {
  type: 'friend-logout'
  uid: number
} | {
  type: 'friend-update'
}

export interface BasicMessage {
  from: number
  to: number
  timestamp: number
}

export interface TextMessage extends BasicMessage {
  type: 'text'
  data: string
}

export interface ImageMessage extends BasicMessage {
  type: 'image'
  mime: string
  width: number
  height: number
  name: string
  size: number
  data: Uint8Array
  localPath?: string
}

export interface FileMessage extends BasicMessage {
  type: 'file'
  name: string
  size: number
  localPath?: string
}

export type Message = TextMessage | ImageMessage | FileMessage

export interface RtcBasicSignal {
  from: number
  to: number
  timestamp: number
  rtcId: string
}

export interface RtcOfferSignal extends RtcBasicSignal {
  type: 'offer'
  offer: RTCSessionDescriptionInit
}

export interface RtcActionSignal extends RtcBasicSignal {
  type: 'action'
  action: 'cancel' | 'reject' | 'close'
}

export interface RtcAnswerSignal extends RtcBasicSignal {
  type: 'answer'
  answer: RTCSessionDescriptionInit
}

export interface RtcIceCandidateSignal extends RtcBasicSignal {
  type: 'ice-candidate'
  candidate: RTCIceCandidateInit
}

export type RtcSignal = RtcOfferSignal | RtcActionSignal | RtcAnswerSignal | RtcIceCandidateSignal
