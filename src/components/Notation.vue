<template lang="pug">
v-card
  template(v-if="game.drawOffered")
    v-layout.font-weight-bold.pt-2(align-center justify-center) Your opponent offered draw
    v-card-actions
        v-btn(flat block @click="acceptDraw")
          v-icon.mr-2 done_outline
          | Accept
        v-btn(flat block @click="denyDraw")
          v-icon.mr-2 close
          | Cancel
  template(v-else)
    v-card-actions
      v-btn(flat block @click="offerDraw")
        v-icon.mr-2 done
        | Offer Draw
      v-btn(flat block @click="resign")
        v-icon.mr-2 outlined_flag
        | Resign
  v-card-text.notation-holder(ref="notationHolder")
    div
      template(v-for="(move, index) in historySliced")
        span {{ `${index + 1}. ` }}
        template(v-for="(ply, plyIndex) in move")
          span {{ ply }}
          span(v-if="plyIndex != 1") {{ ' - '}}
        br
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    history: {
      type: Array
    }
  },

  computed: {
    ...mapState([
      'player', 'game'
    ]),
    historySliced () {
      return [].concat.apply([], this.history.map((ply, i) => {
        return i % 2 ? [] : [this.history.slice(i, i + 2)]
      }))
    }
  },

  methods: {
    offerDraw () {
      this.$socket.sendObj({
        type: 'offerDraw',
        payload: JSON.stringify({
          playerId: this.player.id,
          roomId: this.game.id
        })
      })
    },

    resign () {
      this.$socket.sendObj({
        type: 'resign',
        payload: JSON.stringify({
          playerId: this.player.id,
          roomId: this.game.id
        })
      })
    },

    acceptDraw () {
      this.$socket.sendObj({
        type: 'acceptDraw',
        payload: JSON.stringify({
          playerId: this.player.id,
          roomId: this.game.id
        })
      })

      this.$store.state.game.drawOffered = false
    },

    denyDraw () {
      this.$store.state.game.drawOffered = false
    }
  },

  watch: {
    history: {
      handler () {
        const element = this.$refs.notationHolder
        element.scrollTop = element.scrollHeight - element.clientHeight
      }
    }
  }
}
</script>

<style lang="sass">
.notation-holder
  height: 12rem
  overflow-y: scroll
  font-size: 1.25rem
</style>
