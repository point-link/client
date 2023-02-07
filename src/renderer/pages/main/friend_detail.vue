<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'

import { DEFAULT_AVATAR_URL } from '~/config'
import { useFriendStore } from '~/stores/friend'

const route = useRoute()
const friendStore = useFriendStore()

const friendUid = computed(() => {
  const fu = Number(route.params.friendUid)
  if (isNaN(fu))
    throw new Error('无法获取 friendUid')
  return fu
})
const friend = computed(() => {
  const f = friendStore.getFriend(friendUid.value)
  if (!f)
    throw new Error('无法获取 friend')
  return f
})
</script>

<template>
  <div min-h-full p-10 flex flex-col items-center space-y-10>
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
      <ElFormItem label="备注">
        <ElInput />
      </ElFormItem>
    </ElForm>
    <ElButton>
      保存
    </ElButton>
  </div>
</template>
