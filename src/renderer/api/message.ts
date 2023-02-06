export async function postTextMessage(
  hostAndPort: string,
  from: number,
  to: number,
  timestamp: number,
  text: string,
) {
  const formData = new FormData()
  formData.set('from', from.toString())
  formData.set('to', to.toString())
  formData.set('timestamp', timestamp.toString())
  formData.set('text', text)
  return await fetch(`http://${hostAndPort}/message/text`, {
    method: 'POST',
    body: formData,
  })
}

export async function postImageMessage(
  hostAndPort: string,
  from: number,
  to: number,
  timestamp: number,
  image: File,
  width: number,
  height: number,
) {
  const formData = new FormData()
  formData.set('from', from.toString())
  formData.set('to', to.toString())
  formData.set('timestamp', timestamp.toString())
  formData.set('image', image)
  formData.set('width', width.toString())
  formData.set('height', height.toString())
  return await fetch(`http://${hostAndPort}/message/image`, {
    method: 'POST',
    body: formData,
  })
}

export async function postFileMessage(
  hostAndPort: string,
  from: number,
  to: number,
  timestamp: number,
  file: File,
) {
  const formData = new FormData()
  formData.set('from', from.toString())
  formData.set('to', to.toString())
  formData.set('timestamp', timestamp.toString())
  formData.set('file', file)
  return await fetch(`http://${hostAndPort}/message/file`, {
    method: 'POST',
    body: formData,
  })
}
