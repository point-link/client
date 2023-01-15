import { type Ref, computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '~/typings/app'

export const useAccountStore = defineStore('account', () => {
  const token: Ref<string | undefined> = ref()
  const uid: Ref<number | undefined> = ref()
  const avatar: Ref<string | undefined> = ref()
  const nickname: Ref<string | undefined> = ref()
  const loggedIn = computed(() => Boolean(token))

  function login(tokenStr: string, account: Account) {
    token.value = tokenStr
    uid.value = account.uid
    avatar.value = account.profile.avatar
    nickname.value = account.profile.nickname
  }

  function logout() {
    token.value = undefined
    uid.value = undefined
    avatar.value = undefined
    nickname.value = undefined
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
