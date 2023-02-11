import type { RtcSignal } from '~/typings/app'

export async function postRtcSignal(
  hostAndPort: string,
  signal: RtcSignal,
) {
  return await fetch(`http://${hostAndPort}/rtc/signal`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      signal,
    }),
  })
}
