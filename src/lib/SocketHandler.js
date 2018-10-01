export default class SocketHandler {
  constructor (store, router, uuid, name, host) {
    this.store = store
    this.router = router
    this.uuid = uuid
    this.name = name
    this.socketConnection = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${host}?uuid=${uuid}&name=${name}`)
    this.subscribeForEvents()
  }

  get socket () {
    return this.socketConnection
  }

  subscribeForEvents () {
    this.socketConnection.onmessage = (event) => {
      let msg = JSON.parse(event.data)
      switch (msg.type) {
        case 'connectionUpdate':
          this.store.dispatch('updateUsers', msg.data)
          break
        case 'incomingCall':
          this.store.dispatch('setIncomingCall', msg.data.from)
          break
        case 'outgoingCall':
          this.store.dispatch('setOutgoingCall', msg.data.to)
          this.router.push({name: 'OutgoingCall'})
          break
        case 'cancel':
          this.store.dispatch('setOutgoingCall', null)
          this.store.dispatch('setIncomingCall', null)
          this.router.push({name: 'UserList'})
          break
        case 'answerCall':
          this.store.dispatch('setOutgoingCall', null)
          this.store.dispatch('setIncomingCall', null)
          break
      }
    }
  }

  emit (type, data) {
    let dataToSend = JSON.stringify({
      type,
      data
    })
    this.socketConnection.send(dataToSend)
  }
}
