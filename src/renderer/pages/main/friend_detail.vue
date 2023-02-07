<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElForm, ElFormItem, ElInput, ElTag } from 'element-plus'

import { DEFAULT_AVATAR_URL } from '~/config'
import { useFriendStore } from '~/stores/friend'
import { useAccountStore } from '~/stores/account'
import { putFriendInfo } from '~/api/friend'

const route = useRoute()
const router = useRouter()
const friendStore = useFriendStore()
const accountStore = useAccountStore()

const friend = computed(() => {
  const friendUid = Number(route.params.friendUid)
  if (isNaN(friendUid))
    return
  return friendStore.getFriend(friendUid)
})

const remark = ref<string | undefined>()
const tags = ref<string[]>([])
const tagInputEl = ref<HTMLElement | null>(null)
const tagInputVisible = ref(false)
const tagInputValue = ref('')

watch(friend, () => {
  if (!friend.value)
    return
  remark.value = friend.value.remark
  tags.value = [...friend.value.tags]
}, { immediate: true })

const edited = computed(() => {
  if (!friend.value)
    return false
  return (remark.value !== friend.value.remark)
    || (JSON.stringify(tags.value) !== JSON.stringify(friend.value.tags))
})

function showInput() {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputEl.value!.focus()
  })
}

function handleTagInputConfirm() {
  if (tagInputValue.value) {
    const newTag = tagInputValue.value
    if (!tags.value.includes(newTag))
      tags.value.push(newTag)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

function handleCloseTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

async function save() {
  if (!accountStore.token)
    throw new Error('账号的 token 值为空')
  if (!friend.value?.uid)
    throw new Error('好友的 uid 值为空')
  const res = await putFriendInfo(accountStore.token, friend.value.uid, remark.value, tags.value)
  if (!res.ok)
    throw new Error(`保存好友备注与标签失败，响应状态：${res.status}`)
  await friendStore.refreshFriends()
}
</script>

<template>
  <div min-h-full p-10 space-y-8>
    <div>
      <ElButton @click="router.replace('/main/chat/chatroom')">
        返回
      </ElButton>
    </div>
    <div v-if="friend" flex flex-col items-center space-y-10>
      <img
        w-24 aspect-1
        :src="friend.profile.avatar ? friend.profile.avatar : DEFAULT_AVATAR_URL"
        alt="头像"
      >
      <ElForm label-position="left" label-width="60px">
        <ElFormItem label="UID">
          {{ friend.uid }}
        </ElFormItem>
        <ElFormItem label="用户名">
          {{ friend.username }}
        </ElFormItem>
        <ElFormItem label="昵称">
          {{ friend.profile.nickname }}
        </ElFormItem>
        <ElFormItem label="标签">
          <div space-x-1>
            <ElTag
              v-for="tag of tags" :key="tag"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag)"
            >
              {{ tag }}
            </ElTag>
            <ElInput
              v-if="tagInputVisible"
              ref="tagInputEl"
              v-model="tagInputValue"
              class="ml-1 w-20"
              size="small"
              @keyup.enter="handleTagInputConfirm"
              @blur="handleTagInputConfirm"
            />
            <ElButton
              v-else
              size="small"
              @click="showInput"
            >
              +
            </ElButton>
          </div>
        </ElFormItem>
        <ElFormItem label="备注">
          <ElInput v-model="remark" />
        </ElFormItem>
      </ElForm>
      <ElButton :disabled="!edited" @click="save">
        保存
      </ElButton>
    </div>
  </div>
</template>
