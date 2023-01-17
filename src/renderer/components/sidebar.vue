<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ElTooltip } from 'element-plus'
import { useAccountStore } from '~/stores/account'
import { DEFAULT_AVATAR } from '~/config'

const router = useRouter()
const accountStore = useAccountStore()
</script>

<template>
  <div
    w-full h-full px-2 py-4
    flex flex-col
    bg-gray-600 text-white
  >
    <div
      flex-1
      flex flex-col items-center space-y-4
    >
      <!-- 头像 -->
      <img
        my-2 aspect-1
        :src="accountStore.avatar ? accountStore.avatar : DEFAULT_AVATAR"
        alt="头像"
      >
      <!-- 聊天 -->
      <ElTooltip
        content="聊天"
        placement="right"
      >
        <button icon-btn mx-2 outline-none @click="router.replace('/main/chat')">
          <div i-carbon-chat />
        </button>
      </ElTooltip>
      <!-- 好友请求 -->
      <ElTooltip
        content="好友请求"
        placement="right"
      >
        <button icon-btn mx-2 outline-none @click="router.replace('/main/friend_request')">
          <div i-carbon-friendship />
        </button>
      </ElTooltip>
    </div>
    <div
      flex-1
      flex flex-col-reverse items-center
    >
      <!-- 退出登录 -->
      <ElTooltip
        content="退出登录"
        placement="right"
      >
        <button
          mx-2
          icon-btn outline-none
          @click="() => {
            accountStore.logout()
            router.replace('/login')
          }"
        >
          <div i-carbon-exit />
        </button>
      </ElTooltip>
    </div>
  </div>
</template>
