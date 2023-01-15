<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function logout() {
  sessionStorage.removeItem('token')
  router.replace('/login')
}
</script>

<template>
  <div w-full h-full bg-gray-600>
    S
  </div>
</template>
