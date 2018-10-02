<template lang="pug">
div(class="modal is-active")
  div(class="modal-background")
  div(class="modal-card")
    div(class="modal-card-body incoming-call")
      .
        Incoming call form: {{ caller.name }}
    footer.modal-card-foot
      button(class="button is-success is-rounded is-large" @click="answer")
        i(class="fa fa-phone")
      button(class="button is-danger is-rounded is-large" @click="dismiss")
        i(class="fa fa-times")
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'IncomingCall',
  props: ['from'],
  computed: {
    caller () {
      return this.$store.state.users.find((u) => u.uuid === this.from)
    }
  },
  methods: {
    ...mapActions(['setCallPartnerId']),
    answer () {
      window.communicationSocket.emit('answerCall', {
        targetUser: this.caller.uuid,
        from: this.$store.state.uuid
      })
      this.setCallPartnerId(this.caller.uuid)
      this.$router.push({name: 'Call'})
    },
    dismiss () {
      window.communicationSocket.emit('dismissCall', {
        targetUser: this.caller.uuid
      })
      this.$store.dispatch('setOutgoingCall', null)
      this.$store.dispatch('setIncomingCall', null)
      this.$router.push({name: 'UserList'})
    }
  }
}
</script>

<style lang="stylus" scoped>
.incoming-call
  font-size: 2em;
</style>
