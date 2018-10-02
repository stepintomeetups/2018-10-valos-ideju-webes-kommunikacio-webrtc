<template lang="pug">
  section.section
    div.container
      div.columns
        div.column(v-for="user in users" v-if="users")
          user-card(:user="user" :key="user.id")
        div.column(v-else) No active users
    incoming-call(v-if="hasIncomingCall", :from="incomingCall.from")
</template>

<script>
import IncomingCall from '@/components/IncomingCall'
import UserCard from '@/components/UserCard'
import SocketHandler from '@/lib/SocketHandler'
export default {
  name: 'UserList',
  components: {
    UserCard,
    IncomingCall
  },
  computed: {
    users () {
      return this.$store.state.users.filter(
        (user) => user.uuid !== this.$store.state.uuid
      )
    },
    hasIncomingCall () {
      return !!this.incomingCall.from
    },
    incomingCall () {
      return this.$store.state.incomingCall
    }
  },
  beforeMount () {
    if (!window.communicationSocket) {
      let uuid = this.$store.state.uuid
      let name = this.$store.state.name
      let port = ''
      if (process.env.NODE_ENV !== 'production') {
        port = ':3000'
      }
      /* eslint-disable no-unused-vars */
      window.communicationSocket = new SocketHandler(
        this.$store,
        this.$router,
        uuid,
        name,
        window.location.hostname + port
      )
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
