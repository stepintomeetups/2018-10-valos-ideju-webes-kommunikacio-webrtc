function onSuccess () {}

function onError (error) {
  console.error(error)
}

export default class RTCHandler {
  constructor ({localVideo, remoteVideo, socketHandler, targetId, userId}) {
    this.localVideo = localVideo
    this.remoteVideo = remoteVideo
    this.socketHandler = socketHandler
    this.targetId = targetId
    this.userId = userId
    this.subscribeEventHandlers()
    this.pc = null
    this.configuration = {
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
      }]
    }
  }

  init (isOfferer = false) {
    this.pc = new RTCPeerConnection(this.configuration)

    this.pc.onicecandidate = event => {
      if (event.candidate) {
        this.socketHandler.emit('ice-candidate', {
          'targetUser': this.targetId,
          'candidate': event.candidate
        })
      }
    }

    if (isOfferer) {
      this.pc.onnegotiationneeded = () => {
        this.pc.createOffer().then(desc => this.localDescCreated(desc)).catch(onError)
      }
    }

    this.pc.onaddstream = event => {
      this.remoteVideo.srcObject = event.stream
    }

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(stream => {
      this.localVideo.srcObject = stream
      this.pc.addStream(stream)
    }, onError)
  }

  localDescCreated (desc) {
    this.pc.setLocalDescription(
      desc,
      () => this.socketHandler.emit('sdp', {'targetUser': this.targetId, 'sdp': this.pc.localDescription}),
      onError
    )
  }

  subscribeEventHandlers () {
    this.socketHandler.on('ice-candidate', (msg) => {
      this.pc.addIceCandidate(
        new RTCIceCandidate(msg.candidate),
        onSuccess,
        onError
      )
    })

    this.socketHandler.on('sdp', (msg) => {
      this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), () => {
        if (this.pc.remoteDescription.type === 'offer') {
          this.pc.createAnswer().then(desc => this.localDescCreated(desc)).catch(onError)
        }
      }, onError)
    })
  }
}
