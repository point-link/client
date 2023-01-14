import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Index from '~/pages/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Index,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
