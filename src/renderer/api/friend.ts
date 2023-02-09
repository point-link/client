import type { Client, Friend, FriendRequest } from '~/typings/app'
import { jsonFetch } from '~/utils/net'
import { API_BASE_URL } from '~/config'

export async function putFriendInfo(token: string, friendUid: number, remark: string | undefined, tags: string[]) {
  return fetch(`${API_BASE_URL}/friend/info`, {
    method: 'PUT',
    headers: {
      'x-auth-token': token,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ friendUid, remark, tags }),
  })
}

export async function getFriends(token: string) {
  return jsonFetch<Friend[]>(`${API_BASE_URL}/friend`, {
    method: 'GET',
    headers: { 'x-auth-token': token },
  })
}

export async function getFriendOnlineClients(token: string) {
  return jsonFetch<Client[]>(`${API_BASE_URL}/friend/online_client`, {
    method: 'GET',
    headers: { 'x-auth-token': token },
  })
}

export async function getFriendRequests(
  token: string,
  type: 'requester' | 'target',
  status: number,
) {
  return jsonFetch<FriendRequest[]>(`${API_BASE_URL}/friend_request?type=${type}&status=${status}`, {
    method: 'GET',
    headers: { 'x-auth-token': token },
  })
}

export async function postFriendRequest(token: string, targetUid: number) {
  return fetch(`${API_BASE_URL}/friend_request`, {
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
  return fetch(`${API_BASE_URL}/friend_request/status`, {
    method: 'PUT',
    headers: {
      'x-auth-token': token,
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ role, action, associatedUid }),
  })
}

export async function deleteFriend(token: string, friendUid: number) {
  return fetch(`${API_BASE_URL}/friend?friendUid=${friendUid}`, {
    method: 'delete',
    headers: {
      'x-auth-token': token,
    },
  })
}
