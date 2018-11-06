<template lang="pug">
v-dialog(v-model="show" persistent width="700")
  //- v-btn.ma-0(slot="activator" color="primary" large) {{ $t('createGame') }}
  v-card(color="babyPowder")
    v-card-title.headline.primary.babyPowder--text Send this link to your friend to start playing
    v-divider
    v-card-text.pa-0
      v-container.pb-0(grid-list-md)
        //- .display-1 send this link to your friend to start playing
        v-text-field.pb-4(v-model="link"
                         class="headline"
                         type="text")
          span.title.cursor-pointer(slot="append" v-clipboard:copy="link") Copy
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean
    }
  },

  data () {
    return {
      link: window.location
    }
  }
}
</script>
