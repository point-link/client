export interface NetworkInterfaceInfo {
  address: string
  family: 4 | 6
}

export interface NetworkInterface {
  name: string
  information: NetworkInterfaceInfo[]
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
