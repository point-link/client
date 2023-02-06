import type { DBSchema } from 'idb'
import { openDB } from 'idb'

import type { Message } from '~/typings/app'

interface AppDB extends DBSchema {
  message: {
    value: Message
    key: string
  }
}

async function initAppDB() {
  const db = await openDB<AppDB>('app', 1, {
    upgrade(db) {
      db.createObjectStore('message')
    },
  })
  return db
}

const dbPromise = initAppDB()

export async function putMessage(uid: number, message: Message) {
  const friendUid = message.from === uid ? message.to : message.from
  const db = await dbPromise
  const tx = db.transaction('message', 'readwrite')
  tx.store.put(message, `${uid}-${friendUid}-${message.timestamp}`)
  await tx.done
}

export async function getMessages(uid: number, friendUid: number) {
  const db = await dbPromise
  const messages: Message[] = []
  const tx = db.transaction('message')
  let cursor = await tx.store.openCursor(IDBKeyRange.lowerBound(`${uid}-${friendUid}-0`))
  while (cursor) {
    messages.push(cursor.value)
    cursor = await cursor.continue()
  }
  await tx.done
  return messages
}
