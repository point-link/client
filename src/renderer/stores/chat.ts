import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { useAccountStore } from './account'
import type { Friend, Message } from '~/typings/app'

export const useChatStore = defineStore('chat', () => {
  const onAddNewMessageCallbacks: ((message: Message) => void)[] = []

  const accountStore = useAccountStore()
  const messagesMap = new Map<number, Message[]>()

  const selectedFriend = ref<Friend | undefined>()
  const selectedMessages = computed(() => {
    if (!selectedFriend.value)
      return []
    let messages = messagesMap.get(selectedFriend.value.uid)
    if (!messages) {
      messages = reactive([])
      messagesMap.set(selectedFriend.value.uid, messages)
    }
    return messages
  })

  function addNewMessage(message: Message) {
    if (message.from !== accountStore.uid && message.to !== accountStore.uid)
      return
    const friendUid = message.from === accountStore.uid ? message.to : message.from
    let messages = messagesMap.get(friendUid)
    if (!messages) {
      messages = reactive([])
      messagesMap.set(friendUid, messages)
    }
    messages.push({ ...message })
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
