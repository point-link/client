import type { Account } from '~/typings/app'
import { hex, sha256 } from '~/utils/plain'
import { jsonFetch } from '~/utils/net'
import { API_BASE_PATH } from '~/config'

export async function login(username: string, password: string) {
  password = hex(await sha256(password))
  return jsonFetch<{
    token: string
    account: Account
  }>(`${API_BASE_PATH}/account/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ username, password }),
  })
}

export async function signup(username: string, password: string) {
  password = hex(await sha256(password))
  return fetch(`${API_BASE_PATH}/account/signup`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ username, password }),
  })
}
