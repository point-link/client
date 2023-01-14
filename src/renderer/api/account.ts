import { hex, sha256 } from '~/utils/plain'
import { jsonFetch } from '~/utils/net'

const API_BASE_PATH = 'https://miixinn-server-dev.deno.dev'

export async function login(username: string, password: string) {
  password = hex(await sha256(password))
  return jsonFetch<{ token: string }>(`${API_BASE_PATH}/account/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ username, password }),
  })
}

export async function signup(username: string, password: string) {
  password = hex(await sha256(password))
  return jsonFetch<{ token: string }>(`${API_BASE_PATH}/account`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ username, password }),
  })
}
