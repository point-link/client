import { NetworkInterface } from './app'

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getObservedIp: (family: 4 | 6) => Promise<string>,
  getNetworkInterfaces: () => Promise<NetworkInterface[]>,
  getMessageServerPort: () => Promise<number>,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
