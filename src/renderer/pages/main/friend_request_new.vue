<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElButton, ElInput } from 'element-plus'
import { useRouter } from 'vue-router'
import type { Account } from '~/typings/app'
import { findAccount } from '~/api/account'
import { postFriendRequest } from '~/api/friend'
import { DEFAULT_AVATAR } from '~/config'
import { useAccountStore } from '~/stores/account'
import { useFriendStore } from '~/stores/friend'

const router = useRouter()
const accountStore = useAccountStore()
const friendStore = useFriendStore()

const uid = ref<number | undefined>()
const submittedUid = ref<number | undefined>()
const notFound = ref(false)
const account = ref<Account | undefined>()

const isSelf = computed(() => {
  return accountStore.uid === submittedUid.value
})
const isFriend = computed(() => {
  for (const friend of friendStore.friends) {
    if (friend.uid === submittedUid.value)
      return true
  }
  return false
})
const requested = computed(() => {
  for (const fr of friendStore.friendRequestsAsRequester) {
    if (fr.target.uid === submittedUid.value)
      return true
  }
  for (const fr of friendStore.friendRequestsAsTarget) {
    if (fr.requester.uid === submittedUid.value)
      return true
  }
  return false
})

async function search() {
  if (!uid.value)
    return
  submittedUid.value = uid.value
  const res = await findAccount(submittedUid.value)
  if (!res.ok) {
    account.value = undefined
    if (res.status === 404) {
      notFound.value = true
      return
    }
    else {
      throw new Error(`查找账号失败，响应状态：${res.status}`)
    }
  }
  notFound.value = false
  account.value = await res.json()
}

async function request() {
  if (!accountStore.token)
    throw new Error('账号的 token 值为空')
  if (!submittedUid.value)
    throw new Error('当前页面的 submittedUid 值为空')
  const res = await postFriendRequest(accountStore.token, submittedUid.value)
  if (!res.ok)
    throw new Error(`创建好友请求失败，相应状态：${res.status}`)
  friendStore.refreshFriends()
  friendStore.refreshFriendRequests()
}
</script>

<template>
  <div min-h-full p-4 space-y-4>
    <div>
      <ElButton @click="router.replace('/main/friend_request')">
        返回
      </ElButton>
    </div>

    <div flex space-x-4>
      <ElInput v-model.number="uid" placeholder="请输入要查找账号的 UID" />
      <ElButton @click="search">
        搜索
      </ElButton>
    </div>

    <div
      v-if="account"
      flex flex-col items-center
    >
      <!-- 账号信息 -->
      <div pt-8 text-center space-y-2>
        <img
          :src="account.profile.avatar ? account.profile.avatar : DEFAULT_AVATAR"
          alt="头像"
          w-24 aspect-1
        >
        <div text-xl>
          {{ account.profile.nickname || account.username }}
        </div>
        <div text-sm opacity-75>
          UID: {{ account.uid }}
        </div>
      </div>
      <!-- 申请好友按钮 -->
      <div pt-8>
        <ElButton v-if="isSelf" disabled>
          不可申请自己为好友
        </ElButton>
        <ElButton v-else-if="isFriend" disabled>
          己是好友
        </ElButton>
        <ElButton v-else-if="requested" disabled>
          已申请好友
        </ElButton>
        <ElButton v-else @click="request">
          申请好友
        </ElButton>
      </div>
    </div>

    <div v-if="notFound" text-center pt-8>
      未搜索到相应的账号
    </div>
  </div>
</template>
