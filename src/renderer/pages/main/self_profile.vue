<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { computed, ref } from 'vue'
import { DEFAULT_AVATAR_URL } from '~/config'
import { putAccountProfile } from '~/api/account'
import { useAccountStore } from '~/stores/account'

const accountStore = useAccountStore()
const { token, uid, username, avatar, nickname } = storeToRefs(accountStore)

const editingNickname = ref(nickname.value)
const edited = computed(() => {
  return editingNickname.value !== nickname.value
})

async function save() {
  if (!token.value)
    throw new Error('账号的 token 值为空')
  const res = await putAccountProfile(token.value, {
    avatar: avatar.value,
    nickname: editingNickname.value,
  })
  if (!res.ok)
    throw new Error(`更新个人资料失败，响应状态：${res.status}`)
  accountStore.refreshAccountProfile()
}
</script>

<template>
  <div min-h-full p-10 flex flex-col items-center space-y-10>
    <img
      w-24 aspect-1
      :src="avatar ? avatar : DEFAULT_AVATAR_URL"
      alt="头像"
    >
    <ElForm label-position="left" label-width="60px">
      <ElFormItem label="UID">
        {{ uid }}
      </ElFormItem>
      <ElFormItem label="用户名">
        {{ username }}
      </ElFormItem>
      <ElFormItem label="昵称">
        <ElInput v-model="editingNickname" />
      </ElFormItem>
    </ElForm>
    <ElButton :disabled="!edited" @click="save">
      保存
    </ElButton>
  </div>
</template>
