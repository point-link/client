import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '~/typings/app'

export const useAccountStore = defineStore('account', () => {
  const token = ref<string | undefined>()
  const uid = ref<number | undefined>()
  const avatar = ref<string | undefined>()
  const nickname = ref<string | undefined>()
  const loggedIn = ref(false)

  function login(tokenStr: string, account: Account) {
    token.value = tokenStr
    uid.value = account.uid
    avatar.value = account.profile.avatar
    nickname.value = account.profile.nickname
    loggedIn.value = true
  }

  function logout() {
    token.value = undefined
    uid.value = undefined
    avatar.value = undefined
    nickname.value = undefined
    loggedIn.value = false
  }

  return {
    token,
    uid,
    avatar,
    nickname,
    loggedIn,
    login,
    logout,
  }
})
