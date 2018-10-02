<template lang="pug">
  div(class="box outgoing-call")
    article(class="media")
      div(class="media-content")
        div(class="content")
          p
            strong Calling: {{ called.name }}
        nav(class="level is-mobile")
          a(class="level-item button is-danger is-rounded" aria-label="reply" @click="cancelCall")
            span(class="icon")
              i(class="fa fa-times" aria-hidden="true")
</template>
<script>
export default {
  name: 'OutgoingCall',
  computed: {
    called () {
      return this.$store.state.users.find((u) => u.uuid === this.$store.state.outgoingCall.to)
    }
  },
  methods: {
    cancelCall () {
      window.communicationSocket.emit('cancelCall', {
        targetUser: this.called.uuid
      })
      this.$store.dispatch('setOutgoingCall', null)
      this.$store.dispatch('setIncomingCall', null)
      this.$router.push({name: 'UserList'})
    }
  },
  watch: {
    called (newCalled, oldCalled) {
      if (!newCalled) {
        this.$router.push({name: 'UserList'})
      }
    }
  },
  beforeMount () {
    if (!this.called) {
      this.$router.push({name: 'UserList'})
    }
  }
}
</script>
<style lang="stylus" scoped>
.outgoing-call
  margin: 3em
</style>
