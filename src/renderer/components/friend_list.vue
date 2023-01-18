<script lang="ts" setup>
import { useFriendStore } from '~/stores/friend'
import { DEFAULT_AVATAR_URL } from '~/config'

const friendStore = useFriendStore()
</script>

<template>
  <div w-full h-full bg-gray-200>
    <div
      v-for="friend of friendStore.friends" :key="friend.uid"
      p-2 flex items-center
    >
      <div>
        <img
          w-10 aspect-1
          :src="friend.profile.avatar ? friend.profile.avatar : DEFAULT_AVATAR_URL"
          alt="头像"
        >
      </div>
      <div>
        {{ friend.username }}
      </div>
    </div>
  </div>
</template>
