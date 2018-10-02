<template lang="pug">
section(class="hero is-light is-fullheight")
  div(class="hero-body")
    div(class="container")
      h1(class="title")
        input(class="input" type="text" @input="updateName" placeholder="Give me your name(and soul..)")
      h2(class="subtitle")
        a(class="button is-info" :disabled="!isNameValid" @click="goToApp") GO
</template>
<script>
import {mapActions} from 'vuex'
export default {
  name: 'Login',
  methods: {
    ...mapActions(['setName']),
    updateName (e) {
      this.setName(e.target.value)
    },
    goToApp () {
      window.sessionStorage.setItem('name', this.$store.state.name)
      this.$router.push({name: 'UserList'})
    }
  },
  computed: {
    isNameValid () {
      return this.$store.state.name.length > 3
    }
  }
}
</script>
