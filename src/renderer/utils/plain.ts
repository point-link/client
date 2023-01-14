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
