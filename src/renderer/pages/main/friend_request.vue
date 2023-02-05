<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { useFriendStore } from '~/stores/friend'
import FriendRequestItem from '~/components/FriendRequestItem.vue'

const router = useRouter()

const friendStore = useFriendStore()
</script>

<template>
  <div min-h-full p-4 space-y-8>
    <ElButton @click="router.replace('/main/friend_request_new')">
      添加好友
    </ElButton>
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
  </div>
</template>
