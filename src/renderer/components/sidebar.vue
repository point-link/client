<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAccountStore } from '~/stores/account'
import { DEFAULT_AVATAR } from '~/config'

const router = useRouter()
const accountStore = useAccountStore()

function logout() {
  accountStore.logout()
  router.replace('/login')
}
</script>

<template>
  <div
    w-full h-full px-2 py-4
    flex flex-col
    bg-gray-600 text-white
  >
    <div
      flex-1
      flex flex-col items-center
    >
      <img
        :src="accountStore.avatar ? accountStore.avatar : DEFAULT_AVATAR"
        alt="头像"
      >
    </div>
    <div
      flex-1
      flex flex-col-reverse items-center
    >
      <button icon-btn mx-2 outline-none @click="logout">
        <div i-carbon-exit />
      </button>
    </div>
  </div>
</template>
