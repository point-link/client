<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElTooltip } from 'element-plus'
import { useAccountStore } from '~/stores/account'
import { DEFAULT_AVATAR_URL } from '~/config'

const router = useRouter()
const accountStore = useAccountStore()

const { profile } = storeToRefs(accountStore)
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
      <!-- 个人资料 -->
      <ElTooltip
        content="个人资料"
        placement="right"
      >
        <img
          my-2 aspect-1 cursor-pointer
          :src="profile.avatar ? profile.avatar : DEFAULT_AVATAR_URL"
          alt="头像"
          @click="router.replace('/main/self_profile')"
        >
      </ElTooltip>
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
      <!-- 网络 -->
      <ElTooltip
        content="网络"
        placement="right"
      >
        <button icon-btn mx-2 outline-none @click="router.replace('/main/network')">
          <div i-carbon-content-delivery-network />
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
