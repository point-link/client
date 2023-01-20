import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Account } from '~/typings/app'
import { findAccount } from '~/api/account'

export const useAccountStore = defineStore('account', () => {
  const token = ref<string | undefined>()
  const uid = ref<number | undefined>()
  const username = ref<string | undefined>()
  const avatar = ref<string | undefined>()
  const nickname = ref<string | undefined>()
  const loggedIn = ref(false)

  function login(tokenStr: string, account: Account) {
    token.value = tokenStr
    uid.value = account.uid
    username.value = account.username
    avatar.value = account.profile.avatar
    nickname.value = account.profile.nickname
    loggedIn.value = true
  }

  function logout() {
    token.value = undefined
    uid.value = undefined
    username.value = undefined
    avatar.value = undefined
    nickname.value = undefined
    loggedIn.value = false
  }

  async function refreshAccountProfile() {
    if (!uid.value)
      return
    const res = await findAccount(uid.value)
    if (!res.ok)
      throw new Error(`刷新个人资料失败，响应状态：${res.status}`)
    const account = await res.json()
    avatar.value = account.profile.avatar
    nickname.value = account.profile.nickname
  }

  return {
    token,
    uid,
    username,
    avatar,
    nickname,
    loggedIn,
    login,
    logout,
    refreshAccountProfile,
  }
})
