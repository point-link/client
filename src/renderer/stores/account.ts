import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
  const token = ref('')
  const loggedIn = computed(() => Boolean(token))

  function login(tokenStr: string) {
    token.value = tokenStr
  }

  function logout() {
    token.value = ''
  }

  return {
    token,
    loggedIn,
    login,
    logout,
  }
})
