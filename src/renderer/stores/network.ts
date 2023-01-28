import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { NetworkInterface } from '~/typings/app'
import { getWs, onWsOpen } from '~/ws'

export const useNetworkStore = defineStore('network', () => {
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
  const networkInfo = computed(() => ({
    ipv4: isPublicIpv4.value ? (observedIpv4.value ? observedIpv4.value : null) : null,
    ipv6: isPublicIpv6.value ? (observedIpv6.value ? observedIpv6.value : null) : null,
    port: messageServerPort.value ? messageServerPort.value : null,
  }))

  async function refreshMessageServerPort() {
    messageServerPort.value = await window.electron.getMessageServerPort()
  }

  async function refreshNetworkInterfaces() {
    networkInterfaces.value = await window.electron.getNetworkInterfaces()
  }

  async function refreshObservedIp() {
    observedIpv4.value = await window.electron.getObservedIp(4)
    observedIpv6.value = await window.electron.getObservedIp(6)
  }

  // 初始化
  refreshMessageServerPort()
  refreshNetworkInterfaces()
  refreshObservedIp()
  onWsOpen((ws) => {
    ws.send(JSON.stringify({
      type: 'network',
      ...networkInfo.value,
    }))
  })

  // 每 2s 刷新 networkInterfaces
  let prevInterfaces = JSON.stringify(networkInterfaces.value)
  let prevNetworkInfo = JSON.stringify(networkInfo.value)
  setInterval(async () => {
    await refreshNetworkInterfaces()
    // 当 networkInterfaces 变化时刷新 observedIp
    const currentInterfaces = JSON.stringify(networkInterfaces.value)
    if (prevInterfaces === currentInterfaces)
      return
    prevInterfaces = currentInterfaces
    await refreshObservedIp()
    // 当 observedIp 变化时通过 ws 发送新的网络信息
    const currentNetworkInfo = JSON.stringify(networkInfo.value)
    if (prevNetworkInfo === currentNetworkInfo)
      return
    prevNetworkInfo = currentNetworkInfo
    getWs()?.send(JSON.stringify({
      type: 'network',
      ...networkInfo.value,
    }))
  }, 2000)

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
