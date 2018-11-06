<template lang="pug">
v-app
  v-toolbar(v-if="notHome"
            class="babyPowder--text"
            color="secondary")
    v-toolbar-title FORK
    //- v-spacer
    //- v-toolbar-items.hidden-sm-and-down
    //-   v-btn(flat='') Link One
    //-   v-btn(flat='') Link Two
    //-   v-btn(flat='') Link Three
  v-content
    router-view
  dialogs-wrapper
</template>

<script>
export default {
  computed: {
    notHome () {
      return this.$route.name !== 'home'
    }
  }
}
</script>

<style lang="sass">
.cursor-pointer
  cursor: pointer
</style>
