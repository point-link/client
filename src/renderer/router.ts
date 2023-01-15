import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '~/stores/account'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import Signup from '~/pages/signup.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/signup',
    component: Signup,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore()
  // 检查是否登录
  if (to.path === '/login' || to.path === '/signup' || accountStore.loggedIn)
    next()
  else
    next('/login')
})

export default router
