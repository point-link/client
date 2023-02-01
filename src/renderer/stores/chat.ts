import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Friend } from '~/typings/app'

export const useChatStore = defineStore('chat', () => {
  const selectedFriend = ref<Friend | undefined>()

  return {
    selectedFriend,
  }
})
