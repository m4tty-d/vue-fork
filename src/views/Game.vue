<template lang="pug">
v-container(fluid fill-height)
  v-layout(row wrap align-center)
    v-flex.pr-3(xs3)
      chat
    v-flex(xs6)
      .board-container
        chessboard(:orientation="player.color" :move="game.lastMove" @onMove="move")
    v-flex.pl-3(xs3)
      clock(:base="game.time.base" :additional="game.time.additional" :ticking="opponentsClockTicking")
      notation.my-4(:history="game.history")
      clock.mb-4(:base="game.time.base" :additional="game.time.additional" :ticking="clockTicking")
  send-link-modal(:show="showSendLink")
  //- end-of-game-modal(:show="showEndOfGame")
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
    }
  },

  beforeRouteLeave (to, from, next) {
    if (confirm('Are you sure you\'d like to leave?')) {
      next()
    }
  },

  created () {
    const roomId = this.$route.params.roomId
    if (!this.player.isInitiator && roomId) {
      this.$store.state.game.id = roomId
      this.$socket.sendObj({
        type: 'joinGame',
        payload: JSON.stringify({
          roomId
        })
      })
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
