import { NetworkInterface } from './app'

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getObservedIp: (family: 4 | 6) => Promise<string>,
  getNetworkInterfaces: () => Promise<NetworkInterface[]>,
  getMessageServerPort: () => Promise<number>,
  setNewTextMessageHandler: (handler: (from: number, to: number, textMsg: string) => void) => Promise<void>,
  setNewImageMessageHandler: (handler: (from: number, to: number, mime: string, image: Uint8Array) => void) => Promise<void>,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
