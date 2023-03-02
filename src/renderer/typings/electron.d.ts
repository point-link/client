import type { NetworkInterface, Message, RtcSignal } from './app'

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getObservedIp: (family: 4 | 6) => Promise<string>,
  getNetworkInterfaces: () => Promise<NetworkInterface[]>,
  getMessageServerPort: () => Promise<number>,
  setNewMessageHandler: (handler: (message: Message) => void) => void,
  pathExists: (path: string) => Promise<boolean>
  showItemInfolder: (path: string) => void
  toggleDevtools: () => void
  setRtcSignalHandler: (handler: (signal: RtcSignal) => void) => void,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
