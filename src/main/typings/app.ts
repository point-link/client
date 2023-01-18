export interface NetworkInterfaceInfo {
  address: string
  family: 4 | 6
}

export interface NetworkInterface {
  name: string
  information: NetworkInterfaceInfo[]
}
