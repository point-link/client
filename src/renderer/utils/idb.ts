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
  return await db.put('message', message, `${uid}-${friendUid}-${message.timestamp}`)
}

export async function getMessages(uid: number, friendUid: number) {
  const db = await dbPromise
  return await db.getAll('message', IDBKeyRange.lowerBound(`${uid}-${friendUid}-0`))
}

export async function clearMessages(uid: number, friendUid: number) {
  const db = await dbPromise
  return await db.delete('message', IDBKeyRange.lowerBound(`${uid}-${friendUid}-0`))
}
