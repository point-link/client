<script lang="ts" setup>
import { computed } from 'vue'
import { ElButton } from 'element-plus'
import type { FriendRequest } from '~/typings/app'
import { DEFAULT_AVATAR } from '~/config'
import { useFriendStore } from '~/stores/friend'

const props = defineProps<{
  friendRequest: FriendRequest
  role: 'requester' | 'target'
}>()
const friendStore = useFriendStore()

const fr = computed(() => props.friendRequest)
const role = computed(() => props.role)
const associatedAccount = computed(
  () => role.value === 'requester' ? fr.value.target : fr.value.requester,
)
const updateStatus = computed(() => friendStore.updateFriendRequestStatus)
</script>

<template>
  <div flex items-center>
    <div flex-1>
      <div flex items-center space-x-2>
        <div>
          <img
            w-10 aspect-1
            :src="associatedAccount.profile.avatar ? associatedAccount.profile.avatar : DEFAULT_AVATAR"
            alt="头像"
          >
        </div>
        <div>
          {{ associatedAccount.username }}
        </div>
      </div>
      <div v-if="fr.description">
        备注：{{ fr.description }}
      </div>
    </div>
    <div flex-1 flex flex-row-reverse>
      <template v-if="role === 'requester'">
        <ElButton
          @click="updateStatus('requester', 'cancel', associatedAccount.uid)"
        >
          取消
        </ElButton>
      </template>
      <template v-else>
        <ElButton
          @click="updateStatus('target', 'agree', associatedAccount.uid)"
        >
          同意
        </ElButton>
        <ElButton
          mr-2
          @click="updateStatus('target', 'reject', associatedAccount.uid)"
        >
          拒绝
        </ElButton>
      </template>
    </div>
  </div>
</template>
