import { NetworkInterface } from './app'

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getExposedIpv4: () => Promise<string>,
  getNetworkInterfaces: () => Promise<NetworkInterface[]>,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
