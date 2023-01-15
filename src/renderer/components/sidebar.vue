<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAccountStore } from '~/stores/account'

const router = useRouter()
const accountStore = useAccountStore()

function logout() {
  accountStore.logout()
  router.replace('/login')
}
</script>

<template>
  <div
    w-full h-full
    flex flex-col
    bg-gray-600 text-white
  >
    <div
      px-1 py-4
      flex-1
      flex flex-col items-center
    >
      A
    </div>
    <div
      px-1 py-4
      flex-1
      flex flex-col-reverse items-center
    >
      <button icon-btn mx-2 outline-none @click="logout">
        <div i-carbon-exit />
      </button>
    </div>
  </div>
</template>
