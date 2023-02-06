import { reactive, ref } from 'vue'
import { computedAsync } from '@vueuse/core'
import { defineStore } from 'pinia'

import { useAccountStore } from './account'
import type { Friend, Message } from '~/typings/app'
import { getMessages, putMessage } from '~/utils/idb'

export const useChatStore = defineStore('chat', () => {
  const onAddNewMessageCallbacks: ((message: Message) => void)[] = []
  const accountStore = useAccountStore()

  const messagesMap = new Map<number, Message[]>() // friendUid -> Message[]
  async function getReactiveMessages(friendUid: number) {
    if (!accountStore.uid)
      throw new Error('accountStore.uid 为空值')
    let messages = messagesMap.get(friendUid)
    if (!messages) {
      const _messages = await getMessages(accountStore.uid, friendUid)
      _messages.sort((a, b) => a.timestamp - b.timestamp)
      messages = reactive(_messages)
      messagesMap.set(friendUid, messages)
    }
    return messages
  }

  const selectedFriend = ref<Friend | undefined>()
  const selectedMessages = computedAsync(async () => {
    if (!selectedFriend.value)
      return []
    return await getReactiveMessages(selectedFriend.value.uid)
  })

  async function addNewMessage(message: Message) {
    if (message.from !== accountStore.uid && message.to !== accountStore.uid)
      return
    const friendUid = message.from === accountStore.uid ? message.to : message.from
    const messages = await getReactiveMessages(friendUid)
    messages.push({ ...message })
    await putMessage(accountStore.uid, { ...message })
    for (const cb of onAddNewMessageCallbacks)
      cb({ ...message })
  }

  function onAddNewMessage(cb: (message: Message) => void) {
    onAddNewMessageCallbacks.push(cb)
  }

  window.electron.setNewMessageHandler((message) => {
    addNewMessage(message)
  })

  return {
    selectedFriend,
    selectedMessages,
    addNewMessage,
    onAddNewMessage,
  }
})
