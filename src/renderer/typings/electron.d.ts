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
  getPath: (name: 'home' | 'appData' | 'userData' | 'sessionData' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps') => Promise<string>
  showItemInfolder: (path: string) => void
  toggleDevtools: () => void
  setRtcSignalHandler: (handler: (signal: RtcSignal) => void) => void,
}

declare global {
  interface Window {
    electron: ElectronApi,
  }
}
