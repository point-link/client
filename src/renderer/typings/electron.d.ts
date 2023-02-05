import { NetworkInterface } from './app'

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getObservedIp: (family: 4 | 6) => Promise<string>,
  getNetworkInterfaces: () => Promise<NetworkInterface[]>,
  getMessageServerPort: () => Promise<number>,
  setNewTextMessageHandler: (handler: (from: number, to: number, textMsg: string) => void) => void,
  setNewImageMessageHandler: (handler: (from: number, to: number, name: string, size: number, image: Uint8Array, mime: string, width: number, height: number, localPath?: string) => void) => void,
  setNewFileMessageHandler: (handler: (from: number, to: number, name: string, size: number, localPath?: string) => void) => void,
  pathExists: (path: string) => Promise<boolean>
  showItemInfolder: (path: string) => void
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
