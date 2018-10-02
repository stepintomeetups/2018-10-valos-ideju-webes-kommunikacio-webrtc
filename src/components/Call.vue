<template lang="pug">
  div.container
    div.columns
      div.column
        video.me(ref="localVideo" autoplay="autoplay" muted)
        br
        .
          {{ user.name }}
      div.column
        video.partner(ref="partnerVideo" autoplay="autoplay")
        br
        .
          {{ partner.name }}
    div.columns
      div.column
        button(class="button is-rounded is-danger" @click="hangUpCall") Hang-UP
</template>
<script>
import RTCHandler from '@/lib/RTCHandler'
export default {
  name: 'Call',
  data () {
    return {
      rtcHandler: null
    }
  },
  computed: {
    partner () {
      return this.$store.state.users.find((u) => u.uuid === this.$store.state.call.partner.uuid)
    },
    user () {
      return {name: this.$store.state.name, uuid: this.$store.state.uuid}
    },
    candidate () {
      return this.$store.state.call.partner.candidate
    }
  },
  methods: {
    hangUpCall () {
      window.communicationSocket.emit('hang-up', {targetUser: this.partner.uuid})
      window.communicationSocket.emit('hang-up', {targetUser: this.user.uuid})
    }
  },
  watch: {
    partner: {
      handler (newPartner) {
        if (!newPartner) {
          this.$store.dispatch('setCallPartnerId', null)
          this.$router.push({name: 'UserList'})
        }
      }
    }
  },
  mounted () {
    this.rtcHandler = new RTCHandler({
      localVideo: this.$refs.localVideo,
      remoteVideo: this.$refs.partnerVideo,
      socketHandler: window.communicationSocket,
      targetId: this.partner.uuid,
      userId: this.user.uuid
    })
    this.rtcHandler.init(this.$store.state.call.initiator)
  },
  beforeMount () {
    let state = this.$store.state
    if (!state.call.partner.uuid) {
      this.$router.push({name: 'UserList'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
