<template lang="pug">
v-container(fluid fill-height)
  v-layout(row wrap align-center)
    //- v-flex.pr-3(xs3)
    //-   chat
    template(v-if="$vuetify.breakpoint.smAndDown")
      v-flex.pb-5(fluid xs12)
        clock(owner="opponent" :ticking="opponentsClockTicking")
      v-flex(lg7 md8 xs12)
        .board-container
          chessboard(:orientation="player.color" :move="game.lastMove" @onMove="move")
      v-flex.pt-5(fluid xs12)
        clock(owner="player" :ticking="clockTicking")
      v-flex(fluid xs12)
        notation.my-4(:history="game.history")
    template(v-else)
      v-flex(lg7 md8)
        .board-container
          chessboard(:orientation="player.color" :move="game.lastMove" @onMove="move")
      v-flex.pl-3(lg4 md4)
        clock(owner="opponent" :ticking="opponentsClockTicking")
        notation.my-4(:history="game.history")
        clock.mb-4(owner="player" :ticking="clockTicking")
  send-link-modal(:show="showSendLink")
  end-of-game-modal(:show="showEndOfGame")
</template>

<script>
import Chessboard from '@/components/Chessboard.vue'
import Notation from '@/components/Notation.vue'
import Clock from '@/components/Clock.vue'
import Chat from '@/components/Chat.vue'
import SendLinkModal from '@/components/Modals/SendLink.vue'
import EndOfGameModal from '@/components/Modals/EndOfGame.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Chessboard,
    Notation,
    Clock,
    Chat,
    SendLinkModal,
    EndOfGameModal
  },

  computed: {
    ...mapState([
      'player', 'game'
    ]),
    isGameStarted () {
      return this.game.fen !== '' || this.game.history.length !== 0
    },
    clockTicking () {
      return this.isGameStarted && this.player.color === this.game.turn && this.game.isRunning
    },
    opponentsClockTicking () {
      return this.isGameStarted && this.player.color !== this.game.turn && this.game.isRunning
    },
    showSendLink () {
      return this.player.isInitiator && !this.game.canStart
    },
    showEndOfGame () {
      return this.game.result !== ''
    }
  },

  methods: {
    move (data) {
      const moveStr = data.history[data.history.length - 1]
      this.$store.commit('ADD_MOVE_TO_HISTORY', moveStr)
      this.$store.commit('CHANGE_TURN', data.turn)

      this.$socket.sendObj({
        type: 'move',
        payload: JSON.stringify({
          playerId: this.player.id,
          roomId: this.game.id,
          move: moveStr
        })
      })

      this.$store.state.game.isRunning = true

      if (this.game.drawOffered) {
        this.$store.state.game.drawOffered = false
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    if (confirm('Are you sure you\'d like to leave?')) {
      this.$store.commit('RESET_STATE')
      next()
    }
  }
}
</script>

<style lang="sass">
  .board-container
    .blue, .black, .white
      background-color: transparent !important
      border-color: transparent !important
  .notation
    height: 100%
    width: 100%
</style>
