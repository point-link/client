import { API_WS_URL } from '~/config'

type OnWsOpenCallback = (ws: WebSocket) => void

let ws: WebSocket | undefined
const onWsOpenCbSet = new Set<OnWsOpenCallback>()
const onceOnWsOpenCbSet = new Set<OnWsOpenCallback>()

function setupWs(ws: WebSocket) {
  ws.addEventListener('error', (event) => {
    console.error(event)
  })
  ws.addEventListener('message', (event) => {
    console.log(event)
  })
}

export function getWs() {
  return ws
}

export function openWs(token: string) {
  const _ws = new WebSocket(`${API_WS_URL}?auth_token=${token}`)
  setupWs(_ws)
  _ws.addEventListener('open', () => {
    for (const cb of onceOnWsOpenCbSet)
      cb(_ws)
    onceOnWsOpenCbSet.clear()
    for (const cb of onWsOpenCbSet)
      cb(_ws)
  })
  ws = _ws
  return _ws
}

export function closeWs() {
  if (!ws) {
    console.error('WebSocket 实例未创建')
    return
  }
  if (ws.readyState !== WebSocket.OPEN) {
    console.error(`WebSocket 实例状态为 ${ws.readyState}`)
    return
  }
  ws.close()
  ws = undefined
}

export function onWsOpen(cb: OnWsOpenCallback, once = false) {
  if (once)
    onceOnWsOpenCbSet.add(cb)
  else
    onWsOpenCbSet.add(cb)
}

export function removeOnWsOpenCb(cb: OnWsOpenCallback) {
  return onceOnWsOpenCbSet.delete(cb) || onWsOpenCbSet.delete(cb)
}
