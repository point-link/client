import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'

interface JsonResponse<T = unknown> extends Omit<Response, 'arrayBuffer' | 'blob' | 'formData' | 'text'> {
  json(): Promise<T>
}

export function jsonFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<JsonResponse<T>> {
  return fetch(input, init)
}

export function unauthorizedHandler(router: Router) {
  ElMessage({
    message: '尚未登录',
    type: 'warning',
    duration: 1500,
  })
  router.replace('/login')
}

export function failureHandler(message: string, res: Response | JsonResponse) {
  ElMessage({
    message: `${message}: ${res.status} ${res.statusText}`,
    type: 'error',
    duration: 1500,
  })
  console.error(message, res)
}

export function successHandler(message: string) {
  ElMessage({
    message,
    type: 'success',
    duration: 1500,
  })
}
