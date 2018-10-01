<template lang="pug">
  div(class="notification incoming-call")
    button(class="delete")
    .
      Incoming call form: {{ caller.name }}
    br
    button(class="button is-success is-rounded" @click="answer")
      i(class="fa fa-phone")
    button(class="button is-danger is-rounded" @click="dismiss")
      i(class="fa fa-times")
</template>
<script>
export default {
  name: 'IncomingCall',
  props: ['from'],
  computed: {
    caller () {
      return this.$store.state.users.find((u) => u.uuid === this.from)
    }
  },
  methods: {
    answer () {
      window.communicationSocket.emit('answerCall', {
        to: this.caller.uuid
      })
    },
    dismiss () {
      window.communicationSocket.emit('dismissCall', {
        to: this.caller.uuid
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.incoming-call
  position: absolute
  right: 0
  bottom: 0
</style>
