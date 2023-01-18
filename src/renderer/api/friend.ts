import type { Friend, FriendRequest } from '~/typings/app'
import { jsonFetch } from '~/utils/net'
import { API_BASE_PATH } from '~/config'

export async function getFriends(token: string) {
  return jsonFetch<Friend[]>(`${API_BASE_PATH}/friend`, {
    method: 'GET',
    headers: { 'x-auth-token': token },
  })
}

export async function getFriendRequests(
  token: string,
  type: 'requester' | 'target',
  status: number,
) {
  return jsonFetch<FriendRequest[]>(`${API_BASE_PATH}/friend_request?type=${type}&status=${status}`, {
    method: 'GET',
    headers: { 'x-auth-token': token },
  })
}

export async function postFriendRequest(token: string, targetUid: number) {
  return fetch(`${API_BASE_PATH}/friend_request`, {
    method: 'POST',
    headers: {
      'x-auth-token': token,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ targetUid }),
  })
}

export async function putFriendRequestStatus(
  token: string,
  role: 'requester' | 'target',
  action: 'cancel' | 'agree' | 'reject',
  associatedUid: number,
) {
  return jsonFetch<FriendRequest[]>(`${API_BASE_PATH}/friend_request?role=${role}&action=${action}&associatedUid=${associatedUid}`, {
    method: 'PUT',
    headers: { 'x-auth-token': token },
  })
}
