export default class RTCHandler {
  constructor ({localVideo, remoteVideo, socketHandler, targetId, userId}) {
    this.localVideo = localVideo
    this.remoteVideo = remoteVideo
    this.socketHandler = socketHandler
    this.targetId = targetId
    this.userId = userId
    this.subscribeEventHandlers()
    this.pc = null
  }

  subscribeEventHandlers () {
    // TODO: Create event handlers for signaling
  }
}
