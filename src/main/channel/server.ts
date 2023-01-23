import { createServer } from 'node:net'
import { createDecipheriv } from 'node:crypto'

const server = createServer((socket) => {
  socket.on('error', (err) => {
    console.log(err)
  })

  socket.on('data', (data) => {
    console.log('socket', new Uint8Array(data))
  })

  const decipher = createDecipheriv('aes-256-gcm', new Uint8Array(32), new Uint8Array(16))
  socket.pipe(decipher)
  decipher.on('data', (data) => {
    console.log('decipher', new Uint8Array(data))
  })
})

function listen() {
  while (true) {
    try {
      const port = 10000 + Math.floor(Math.random() * 55535)
      server.listen(port)
      return port
    }
    catch (err) {}
  }
}

export const port = listen()
