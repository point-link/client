import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/login',
    component: Login,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  // 检查是否登录
  if (to.path === '/login' || sessionStorage.getItem('token'))
    next()
  else
    next('/login')
})
