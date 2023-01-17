import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAccountStore } from './account'
import { getFriends } from '~/api/account'
import type { Friend } from '~/typings/app'

export const useFriendStore = defineStore('friend', () => {
  const accountStore = useAccountStore()
  const token = computed(() => accountStore.token)

  const friends = ref<Friend[]>([])

  async function updateFriends() {
    if (!token.value) {
      friends.value = []
      return
    }
    const res = await getFriends(token.value)
    if (!res.ok)
      throw new Error(`获取好友失败，响应状态：${res.status}`)
    friends.value = await res.json()
  }

  watch(token, () => {
    updateFriends()
  })

  return {
    friends,
    updateFriends,
  }
})
