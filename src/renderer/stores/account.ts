import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Account, Profile } from '~/typings/app'
import { findAccount } from '~/api/account'
import { createWs } from '~/utils/net'

export const useAccountStore = defineStore('account', () => {
  const token = ref<string | undefined>()
  const uid = ref<number | undefined>()
  const username = ref<string | undefined>()
  const profile = ref<Profile>({})
  const loggedIn = ref(false)
  const ws = ref<WebSocket | undefined>()

  function login(tokenStr: string, account: Account) {
    token.value = tokenStr
    uid.value = account.uid
    username.value = account.username
    profile.value = account.profile
    loggedIn.value = true
    // 设置 WebSocket
    const socket = createWs(token.value)
    let heartbeatInterval = 0
    socket.onopen = () => {
      socket.send('{"type":"action","action":"login"}')
      socket.send('{"type":"heartbeat"}')
      // 每 10s 发送一次心跳包
      heartbeatInterval = setInterval(() => {
        socket.send('{"type":"heartbeat"}')
      }, 10000)
    }
    socket.onclose = () => {
      ws.value = undefined
      clearInterval(heartbeatInterval)
    }
    socket.onerror = (event) => {
      console.log(event)
    }
    socket.onmessage = (event) => {
      console.log(event)
    }
    ws.value = socket
  }

  function logout() {
    token.value = undefined
    uid.value = undefined
    username.value = undefined
    profile.value = {}
    loggedIn.value = false
    ws.value?.send('{"type":"action","action":"logout"}')
    ws.value?.close()
    ws.value = undefined
  }

  async function refreshAccountProfile() {
    if (!uid.value)
      return
    const res = await findAccount(uid.value)
    if (!res.ok)
      throw new Error(`刷新个人资料失败，响应状态：${res.status}`)
    const account = await res.json()
    profile.value = account.profile
  }

  return {
    token,
    uid,
    username,
    profile,
    loggedIn,
    ws,
    login,
    logout,
    refreshAccountProfile,
  }
})
