<template lang="pug">
  div(class="box")
    div(class="media-content")
      div(class="content")
        p(align="center")
          strong {{user.name}}
          small  \#{{ user.uuid }}
      nav(class="level is-mobile")
        div(class="level-item has-text-centered")
          a(class="phone-call-icon" aria-label="reply" @click="callUser" v-if="!hasIncomingCall")
            span(class="icon")
              i(class="fa fa-phone" aria-hidden="true")
</template>
<script>
export default {
  name: 'UserCard',
  props: ['user'],
  computed: {
    hasIncomingCall () {
      return !!this.$store.state.incomingCall.from
    }
  },
  methods: {
    callUser (e) {
      window.communicationSocket.emit('callUser', {
        targetUser: this.user.uuid,
        from: this.$store.state.uuid
      })
      this.$store.dispatch('setOutgoingCall', this.user.uuid)
      this.$store.dispatch('setInitiator', true)
      this.$router.push({name: 'OutgoingCall'})
    }
  }
}
</script>

<style lang="stylus" scoped>
.phone-call-icon .icon
  color: #FFF
  background-color: #000
  border-radius: 50%
.phone-call-icon:hover .icon
  color: #00FF00;
</style>
