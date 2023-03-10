import dayjs from 'dayjs'

export async function sha256(data: string | Uint8Array) {
  const encoder = new TextEncoder()
  const buffer = typeof data === 'string' ? encoder.encode(data) : data
  const digest = await crypto.subtle.digest(
    'SHA-256',
    buffer,
  )
  return new Uint8Array(digest)
}

export function hex(data: Uint8Array) {
  return Array.from(data).map(b => b.toString(16)).join('')
}

export async function asyncIgnoreError<T>(func: () => Promise<T>) {
  try {
    return await func()
  }
  catch (_err) {
    return undefined
  }
}

export function syncIgnoreError<T>(func: () => T) {
  try {
    return func()
  }
  catch (_err) {
    return undefined
  }
}

/**
 * 将单位为毫秒的时间戳格式化为时间字符串。
 * @param timestamp ms
 */
export function formatTime(timestamp: number) {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}
