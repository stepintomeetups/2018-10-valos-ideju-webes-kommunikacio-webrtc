const express = require('express')
const WebSocket = require('ws')
const url = require('url')
const path = require('path')

const PORT = process.env.PORT

let connections = []

const server = express()
  .use(express.static(path.join(__dirname, '../dist')))
  .listen(PORT, () => console.log(`Listening on http://127.0.0.1:${ PORT }`))

const wss = new WebSocket.Server({ server, perMessageDeflate: false })

wss.broadcast = (type, data) => {
  let dataWithoutSocket = data.map((d) => {
    return {name: d.name, uuid: d.uuid}
  })
  let dataToSend = JSON.stringify({
    type, data: dataWithoutSocket
  })

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(dataToSend)
    }
  })
}

wss.on('connection', (ws, req) => {
  const { query: { uuid, name } } = url.parse(req.url, true)
  connections.push({uuid, name, ws})
  wss.broadcast('connectionUpdate', connections)
  ws.on('close', () => {
    connections = connections.filter((connection) => connection.uuid !== uuid)
    wss.broadcast('connectionUpdate', connections)
  })
  ws.onmessage = (event) => {
    let msg = JSON.parse(event.data)
    switch (msg.type) {
      case 'callUser':
        let userToCall = connections.find((u) => u.uuid === msg.data.uuid)
        let caller = connections.find((u) => u.uuid === uuid)
        userToCall.ws.send(JSON.stringify({type: 'incomingCall', data: {from: uuid}}))
        caller.ws.send(JSON.stringify({type: 'outgoingCall', data: {to: userToCall.uuid}}))
        break
      case 'cancelCall':
      case 'dismissCall':
        let userToCancel = connections.find((u) => u.uuid === msg.data.to)
        let canceller = connections.find((u) => u.uuid === uuid)
        userToCancel.ws.send(JSON.stringify({type: 'cancel', data: {}}))
        canceller.ws.send(JSON.stringify({type: 'cancel', data: {}}))
        break
      case 'answerCall':
        let userToAnswer = connections.find((u) => u.uuid === msg.data.to)
        userToAnswer.ws.send(JSON.stringify({
          type: 'answer',
          data: {
            from: uuid
          }
        }))
        break
    }
  }
})
