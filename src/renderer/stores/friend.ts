import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAccountStore } from './account'
import {
  getFriendOnlineClients,
  getFriendRequests,
  getFriends,
  putFriendRequestStatus,
} from '~/api/friend'
import type { Client, Friend, FriendRequest } from '~/typings/app'

export const useFriendStore = defineStore('friend', () => {
  const accountStore = useAccountStore()
  const token = computed(() => accountStore.token)

  const friends = ref<Friend[]>([])
  const friendRequestsAsRequester = ref<FriendRequest[]>([])
  const friendRequestsAsTarget = ref<FriendRequest[]>([])
  const friendOnlineClients = ref<Record<number, Client | undefined>>({})

  function getFriend(uid: number) {
    for (const friend of friends.value) {
      if (friend.uid === uid)
        return friend
    }
  }

  function addOnlineClient(client: Client) {
    friendOnlineClients.value[client.uid] = client
  }

  function removeOnlineClient(uid: number) {
    const c = friendOnlineClients.value[uid]
    friendOnlineClients.value[uid] = undefined
    return !!c
  }

  async function refreshFriends() {
    if (!token.value) {
      friends.value = []
      return
    }
    const res = await getFriends(token.value)
    if (!res.ok)
      throw new Error(`获取好友失败，响应状态：${res.status}`)
    friends.value = await res.json()
  }

  async function refreshFriendRequests() {
    if (!token.value) {
      friendRequestsAsRequester.value = []
      friendRequestsAsTarget.value = []
      return
    }
    const res1 = await getFriendRequests(token.value, 'requester', 1)
    if (!res1.ok)
      throw new Error(`获取好友请求失败，响应状态：${res1.status}`)
    friendRequestsAsRequester.value = await res1.json()
    const res2 = await getFriendRequests(token.value, 'target', 1)
    if (!res2.ok)
      throw new Error(`获取好友请求失败，响应状态：${res2.status}`)
    friendRequestsAsTarget.value = await res2.json()
  }

  async function refreshFriendOnlineClients() {
    if (!token.value) {
      friendOnlineClients.value = {}
      return
    }
    const res = await getFriendOnlineClients(token.value)
    if (!res.ok)
      throw new Error(`获取在线好友客户端信息失败，响应状态：${res.status}`)
    const clients = await res.json()
    for (const c of clients)
      addOnlineClient(c)
  }

  async function updateFriendRequestStatus(
    role: 'requester' | 'target',
    action: 'cancel' | 'agree' | 'reject',
    associatedUid: number,
  ) {
    if (!token.value)
      throw new Error('账号的 token 值为空')
    const res = await putFriendRequestStatus(token.value, role, action, associatedUid)
    if (!res.ok)
      throw new Error(`改变好友请求状态失败，响应状态：${res.status}`)
    refreshFriendRequests()
    if (action === 'agree')
      refreshFriends()
  }

  watch(token, () => {
    refreshFriends()
    refreshFriendRequests()
    refreshFriendOnlineClients()
  }, {
    immediate: true,
  })

  return {
    friends,
    friendRequestsAsRequester,
    friendRequestsAsTarget,
    friendOnlineClients,
    getFriend,
    addOnlineClient,
    removeOnlineClient,
    refreshFriends,
    refreshFriendRequests,
    refreshFriendOnlineClients,
    updateFriendRequestStatus,
  }
})
