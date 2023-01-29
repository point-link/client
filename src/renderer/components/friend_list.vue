<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFriendStore } from '~/stores/friend'
import { DEFAULT_AVATAR_URL } from '~/config'

const { friends } = storeToRefs(useFriendStore())
</script>

<template>
  <div w-full h-full bg-gray-100 border-r-1>
    <div
      v-for="friend of friends" :key="friend.uid"
      p-2 flex items-center space-x-2
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
