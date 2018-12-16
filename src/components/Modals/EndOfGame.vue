<template lang="pug">
v-dialog(v-model="show" persistent width="400")
  v-card(color="babyPowder")
    v-card-title.headline.primary.babyPowder--text Game ended - {{ resultStr }}
    v-divider
    v-container.pa-2
      v-layout.py-2(row wrap)
        v-flex(md6 xs12)
          v-btn(block color="secondary" @click="rematch") I want a rematch
        v-flex(md6 xs12)
          v-btn(block color="primary")
            | Save game as pgn
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
      'game', 'player'
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

  methods: {
    rematch () {
      this.$socket.sendObj({
        type: 'rematch',
        payload: JSON.stringify({
          roomId: this.game.id,
          playerId: this.player.id
        })
      })
    }
  }
}
</script>
