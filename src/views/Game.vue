<template lang="pug">
v-container(fluid fill-height)
  v-layout(row wrap align-center)
    v-flex.pr-3(xs3)
      chat
    v-flex(xs6)
      .board-container
        chessboard(:orientation="player.color" :fen="game.fen" @onMove="move")
    v-flex.pl-3(xs3)
      clock(:base="game.time.base" :additional="game.time.additional" :ticking="opponentsClockTicking")
      notation.my-4(:history="history")
      clock.mb-4(:base="game.time.base" :additional="game.time.additional" :ticking="clockTicking")
  send-link-modal(:show="showSendLink")
</template>

<script>
import Chessboard from '@/components/Chessboard.vue'
import Notation from '@/components/Notation.vue'
import Clock from '@/components/Clock.vue'
import Chat from '@/components/Chat.vue'
import SendLinkModal from '@/components/Modals/SendLink.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Chessboard,
    Notation,
    Clock,
    Chat,
    SendLinkModal
  },

  data () {
    return {
      history: [],
      turn: '',
      isGameStarted: false
    }
  },

  computed: {
    ...mapState([
      'player', 'game'
    ]),
    clockTicking () {
      return this.isGameStarted && this.player.color === this.turn
    },
    opponentsClockTicking () {
      return this.isGameStarted && this.player.color !== this.turn
    },
    showSendLink () {
      return this.player.isInitiator && !this.game.canStart
    }
  },

  methods: {
    move (data) {
      this.history = data.history
      if (this.history.length) {
        this.isGameStarted = true
      }
      this.turn = data.turn

      this.$socket.sendObj({
        type: 'move',
        payload: JSON.stringify({
          playerId: this.player.id,
          roomId: this.game.id,
          move: data.history[data.history.length - 1]
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
