<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ElOption, ElSelect } from 'element-plus'

import { computed, ref } from 'vue'
import { useFriendStore } from '~/stores/friend'
import { useChatStore } from '~/stores/chat'
import { useNetworkStore } from '~/stores/network'
import { DEFAULT_AVATAR_URL, DISPLAY_MODE_ENABLE } from '~/config'
import type { Friend } from '~/typings/app'

const router = useRouter()
const { networkInfo } = storeToRefs(useNetworkStore())
const { friends, friendOnlineClients } = storeToRefs(useFriendStore())
const { selectedFriend } = storeToRefs(useChatStore())

const tag = ref('')
const tags = computed(() => {
  const set = new Set<string>()
  for (const friend of friends.value) {
    for (const tag of friend.tags)
      set.add(tag)
  }
  return Array.from(set)
})

function openChatroom(friend: Friend) {
  selectedFriend.value = friend
  router.replace('/main/chat/chatroom')
}

function getFriendStatus(uid: number) {
  const client = friendOnlineClients.value[uid]
  if (!client)
    return 'offline'
  else if (
    (client.ipv6 && networkInfo.value.ipv6)
      || (client.ipv4 && networkInfo.value.ipv4)
      || DISPLAY_MODE_ENABLE
  )
    return 'online-linkable'
  else
    return 'online-unlinkable'
}
</script>

<template>
  <div w-full h-full bg-gray-100 border-r-1>
    <div p-2>
      <ElSelect
        v-model="tag"
        clearable
        placeholder="标签筛选"
      >
        <ElOption
          v-for="t of tags" :key="t"
          :value="t"
          :label="t"
        />
      </ElSelect>
    </div>

    <template v-for="friend of friends">
      <div
        v-if="tag ? friend.tags.includes(tag) : true"
        :key="friend.uid"
        p-2 flex items-center space-x-2
        border-l-4
        cursor-pointer
        :class="{
          'bg-gray-300': selectedFriend?.uid === friend.uid,
          'border-gray': getFriendStatus(friend.uid) === 'offline',
          'border-yellow': getFriendStatus(friend.uid) === 'online-unlinkable',
          'border-green': getFriendStatus(friend.uid) === 'online-linkable',
        }"
        @click="openChatroom(friend)"
      >
        <div>
          <img
            w-10 aspect-1
            :src="friend.profile.avatar ? friend.profile.avatar : DEFAULT_AVATAR_URL"
            alt="头像"
          >
        </div>
        <div>
          {{ friend.remark || friend.profile.nickname || friend.username }}
        </div>
      </div>
    </template>
    <template v-if="friends.length === 0">
      <div text-center py-4 opacity-75>
        无好友
      </div>
    </template>
  </div>
</template>
