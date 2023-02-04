export async function postTextMsg(hostAndPort: string, from: number, to: number, textMsg: string) {
  return await fetch(`http://${hostAndPort}/message/text`, {
    method: 'POST',
    headers: {
      'x-from': `${from}`,
      'x-to': `${to}`,
      'content-type': 'text/plain; charset=UTF-8',
    },
    body: textMsg,
  })
}

export async function postImageMsg(hostAndPort: string, from: number, to: number, image: File) {
  const formData = new FormData()
  formData.set('image', image)
  return await fetch(`http://${hostAndPort}/message/image`, {
    method: 'POST',
    headers: {
      'x-from': `${from}`,
      'x-to': `${to}`,
    },
    body: formData,
  })
}
