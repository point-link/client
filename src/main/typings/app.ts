export interface NetworkInterfaceInfo {
  address: string
  family: 4 | 6
}

export interface NetworkInterface {
  name: string
  information: NetworkInterfaceInfo[]
}

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
