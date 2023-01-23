import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useAccountStore } from './account'
import type { NetworkInterface } from '~/typings/app'

export const useNetworkStore = defineStore('network', () => {
  const accountStore = useAccountStore()

  const messageServerPort = ref<number | undefined>()
  const networkInterfaces = ref<NetworkInterface[]>([])
  const localIps = computed(() => {
    const arr: string[] = []
    for (const i of networkInterfaces.value)
      arr.push(...i.information.map(info => info.address))
    return arr
  })

  const observedIpv4 = ref<string | undefined>()
  const observedIpv6 = ref<string | undefined>()

  const isPublicIpv4 = computed(() => {
    if (!observedIpv4.value)
      return false
    return localIps.value.includes(observedIpv4.value)
  })
  const isPublicIpv6 = computed(() => {
    if (!observedIpv6.value)
      return false
    return localIps.value.includes(observedIpv6.value)
  })

  async function refreshNetworkInterfaces() {
    networkInterfaces.value = await window.electron.getNetworkInterfaces()
  }

  async function refreshObservedIp() {
    observedIpv4.value = await window.electron.getObservedIp(4)
    observedIpv6.value = await window.electron.getObservedIp(6)
  }

  // 初始化
  refreshNetworkInterfaces()
  refreshObservedIp()
  window.electron.getMessageServerPort()
    .then(port => messageServerPort.value = port)
  // 定时刷新接口数据
  let prevInterfaces = JSON.stringify(networkInterfaces.value)
  setInterval(async () => {
    await refreshNetworkInterfaces()
    const currentInterfaces = JSON.stringify(networkInterfaces.value)
    // 当接口变化时刷新 observedIp
    if (prevInterfaces !== currentInterfaces) {
      prevInterfaces = currentInterfaces
      await refreshObservedIp()
    }
  }, 5000)

  // 定时通过 WebSocket 向服务器发送网络信息
  setInterval(() => {
    if (!accountStore.ws)
      return
    if (accountStore.ws.readyState === WebSocket.OPEN) {
      accountStore.ws.send(JSON.stringify({
        type: 'network',
        ipv4: isPublicIpv4.value ? observedIpv4.value : null,
        ipv6: isPublicIpv6.value ? observedIpv6.value : null,
        port: messageServerPort.value ? messageServerPort.value : null,
      }))
    }
  }, 5000)

  return {
    messageServerPort,
    networkInterfaces,
    localIps,
    observedIpv4,
    observedIpv6,
    isPublicIpv4,
    isPublicIpv6,
    refreshNetworkInterfaces,
    refreshObservedIp,
  }
})
