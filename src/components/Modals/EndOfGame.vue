<template lang="pug">
v-dialog(v-model="show" persistent width="400")
  v-card(color="babyPowder")
    v-card-title.headline.primary.babyPowder--text Game ended - {{ resultStr }}
    v-divider
    v-container.pa-2
      v-layout.py-2(justify-space-around)
        v-btn(color="secondary") Rematch
        v-btn(color="primary")
          | Save game
          v-icon(right) cloud_download
      router-link(:to="{name: 'home'}" tag="a" class="cursor-pointer") Back home
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean
    }
  },

  computed: {
    ...mapState([
      'game'
    ]),

    resultStr () {
      if (this.game.result === '0-1') {
        return 'Black won'
      } else if (this.game.result === '1-0') {
        return 'White won'
      }

      return 'Draw'
    }
  },

  data () {
    return {
      link: window.location
    }
  }
}
</script>
