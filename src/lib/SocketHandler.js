export default class SocketHandler {
  constructor (store, router, uuid, name, host) {
    this.store = store
    this.router = router
    this.uuid = uuid
    this.name = name
    this.socketConnection = new WebSocket(`${window.location.protocol.replace('http', 'ws')}//${host}?uuid=${uuid}&name=${name}`)
    this.callbacks = []
    this.subscribeForEvents()
    this.socketConnection.onmessage = (event) => {
      let msg = JSON.parse(event.data)
      let subscriber = this.callbacks.find((callback) => callback.type === msg.type)
      if (subscriber) {
        subscriber.callback(msg.data)
      }
    }
  }

  get socket () {
    return this.socketConnection
  }

  on (type, callback) {
    this.callbacks.push({type, callback})
  }

  subscribeForEvents () {
    this.on('connectionUpdate', (data) => {
      this.store.dispatch('updateUsers', data)
    })

    this.on('callUser', (data) => {
      this.store.dispatch('setIncomingCall', data.from)
      this.store.dispatch('setInitiator', false)
    })

    let dismissCallback = (data) => {
      this.store.dispatch('setOutgoingCall', null)
      this.store.dispatch('setIncomingCall', null)
      this.store.dispatch('setInitiator', false)
      this.router.push({name: 'UserList'})
    }
    this.on('dismissCall', dismissCallback)
    this.on('cancelCall', dismissCallback)

    this.on('answerCall', (data) => {
      this.store.dispatch('setOutgoingCall', null)
      this.store.dispatch('setIncomingCall', null)
      this.store.dispatch('setCallPartnerId', data.from)
      this.router.push({name: 'Call'})
    })
  }

  emit (type, data) {
    let dataToSend = JSON.stringify({
      type,
      data
    })
    this.socketConnection.send(dataToSend)
  }
}
