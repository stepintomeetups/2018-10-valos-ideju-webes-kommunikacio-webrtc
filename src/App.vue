<template lang="pug">
  div#app
    router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '~bulma/bulma';
$fa-font-path: '~font-awesome/fonts';
@import '~font-awesome/scss/font-awesome';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: hsl(210, 29%, 24%);
}
</style>
