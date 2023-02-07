<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useFriendStore } from '~/stores/friend'
import { useChatStore } from '~/stores/chat'
import { DEFAULT_AVATAR_URL } from '~/config'
import type { Friend } from '~/typings/app'

const router = useRouter()
const { friends } = storeToRefs(useFriendStore())
const { selectedFriend } = storeToRefs(useChatStore())

function openChatroom(friend: Friend) {
  selectedFriend.value = friend
  router.replace('/main/chat/chatroom')
}
</script>

<template>
  <div w-full h-full bg-gray-100 border-r-1>
    <div
      v-for="friend of friends" :key="friend.uid"
      p-2 flex items-center space-x-2
      cursor-pointer
      :class="{
        'bg-gray-300': selectedFriend?.uid === friend.uid,
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
        {{ friend.profile.nickname || friend.username }}
      </div>
    </div>
  </div>
</template>
