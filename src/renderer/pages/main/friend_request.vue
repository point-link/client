<script lang="ts" setup>
import { useFriendStore } from '~/stores/friend'
import FriendRequestItem from '~/components/friend_request_item.vue'

const friendStore = useFriendStore()
</script>

<template>
  <div
    h-full w-full p-4
    space-y-8
  >
    <!-- 向我发起的好友请求 -->
    <div
      v-if="friendStore.friendRequestsAsTarget.length > 0"
      space-y-4
    >
      <h2>向我发起的好友请求</h2>
      <FriendRequestItem
        v-for="fr of friendStore.friendRequestsAsTarget" :key="fr.requester.uid"
        :friend-request="fr"
        role="target"
      />
    </div>
    <!-- 我发起的好友请求 -->
    <div
      v-if="friendStore.friendRequestsAsRequester.length > 0"
      space-y-4
    >
      <h2>我发起的好友请求</h2>
      <FriendRequestItem
        v-for="fr of friendStore.friendRequestsAsRequester" :key="fr.target.uid"
        :friend-request="fr"
        role="requester"
      />
    </div>
    <div
      v-if="
        friendStore.friendRequestsAsTarget.length === 0
          && friendStore.friendRequestsAsRequester.length === 0"
    >
      暂无好友请求
    </div>
  </div>
</template>
