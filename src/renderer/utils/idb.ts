import type { DBSchema } from 'idb'
import { openDB } from 'idb'

import type { Message } from '~/typings/app'

interface MessageDB extends DBSchema {
  message: {
    value: Message
    key: string
  }
}

async function initMessageDB() {
  const db = await openDB<MessageDB>('message-db', 1, {
    upgrade(db) {
      db.createObjectStore('message')
    },
  })
  return db
}

const db = await initMessageDB()

async function putMessage(message: Message) {
  return await db.put('message', message, `${message.from}-${message.to}-${Date.now()}`)
}

async function getMessages(from: number, to: number) {
  const messages: Message[] = []
  const tx = db.transaction('message')
  const store = tx.objectStore('message')
  let cursor = await store.openCursor(IDBKeyRange.lowerBound(`${from}-${to}-0`))
  while (cursor) {
    messages.push(cursor.value)
    cursor = await cursor.continue()
  }
  await tx.done
  return messages
}
