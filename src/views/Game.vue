<template lang="pug">
v-container(fluid fill-height)
  v-layout(row wrap align-center)
    v-flex.pr-3(xs3)
      chat
    v-flex(xs6)
      .board-container
        chessboard(:orientation="getBoardOrientation" @onMove="move")
    v-flex.pl-3(xs3)
      clock(:base="getBaseTime" :additional="getAdditionalTime" :ticking="opponentsClockTicking")
      notation.my-4(:history="history")
      clock.mb-4(:base="getBaseTime" :additional="getAdditionalTime" :ticking="clockTicking")
  send-link-modal(:show="showSendLink")
</template>

<script>
import Chessboard from '@/components/Chessboard.vue'
import Notation from '@/components/Notation.vue'
import Clock from '@/components/Clock.vue'
import Chat from '@/components/Chat.vue'
import SendLinkModal from '@/components/Modals/SendLink.vue'
import { mapGetters } from 'vuex'

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
    ...mapGetters([
      'getBoardOrientation',
      'getBaseTime',
      'getAdditionalTime',
      'isPlayerInitiator',
      'canGameStart'
    ]),
    clockTicking () {
      return this.isGameStarted && this.getBoardOrientation === this.turn
    },
    opponentsClockTicking () {
      return this.isGameStarted && this.getBoardOrientation !== this.turn
    },
    showSendLink () {
      return this.isPlayerInitiator && !this.canGameStart
    }
  },

  methods: {
    move (data) {
      this.history = data.history
      if (this.history.length) {
        this.isGameStarted = true
      }
      this.turn = data.turn
    }
  },

  beforeRouteLeave (to, from, next) {
  },

  created () {
    const roomId = this.$route.params.roomId
    if (!this.isPlayerInitiator && roomId) {
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
