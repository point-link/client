import type { NetworkInterface, Message } from './app'

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
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
