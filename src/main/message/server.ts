import { createServer } from 'node:net'

const server = createServer((socket) => {
  socket.on('error', (err) => {
    console.log(err)
  })

  socket.on('data', (data) => {
    console.log('data', new Uint8Array(data))
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
