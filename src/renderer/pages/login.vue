<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElInput } from 'element-plus'
import { login as loginApi } from '~/api/account'
import { failureHandler } from '~/utils/net'
import { useAccountStore } from '~/stores/account'

const router = useRouter()
const accountStore = useAccountStore()

const username = ref('')
const password = ref('')

async function login() {
  const res = await loginApi(username.value, password.value)
  if (!res.ok) {
    failureHandler('登录失败', res)
    return
  }
  const { token, account } = await res.json()
  accountStore.login(token, account)
  router.replace('/')
  username.value = ''
  password.value = ''
}
</script>

<template>
  <div
    p-12 flex flex-col items-center
    space-y-4
  >
    <h1 text-xl font-bold>
      登录 MiiXinn 账号
    </h1>
    <div w-64>
      <ElInput
        v-model="username"
        placeholder="用户名"
      />
    </div>
    <div w-64>
      <ElInput
        v-model="password"
        type="password"
        placeholder="密码"
        show-password
      />
    </div>
    <div>
      <ElButton @click="login">
        登录
      </ElButton>
    </div>
    <div
      text-sm
      opacity-75
    >
      <span hover:text-blue cursor-pointer @click="$router.replace('/signup')">
        注册
      </span>
    </div>
  </div>
</template>
