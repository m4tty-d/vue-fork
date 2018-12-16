<template lang="pug">
v-card
  v-card-title(:class="{'active-background': ticking, 'babyPowder--text': ticking}")
    .display-2.font-weight-light {{ getMinutesAndSeconds }}
    .ml-auto.headline.font-weight-light {{ score }}
    //- .headline {{ getMilliseconds }}
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  props: {
    owner: {
      type: String,
      required: true
    },
    ticking: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    ...mapState([
      'game', 'scores'
    ]),
    score () {
      return this.scores[this.owner]
    },
    milliseconds () {
      return this.$store.state.stopper[this.owner]
    },
    getMinutesAndSeconds () {
      return moment.utc(this.milliseconds).format('mm:ss')
    },
    getMilliseconds () {
      return moment.utc(this.milliseconds).format(':SS')
    }
  },

  data () {
    return {
      timer: null,
      intervalId: null
    }
  },

  methods: {
    tick () {
      if (this.ticking) {
        this.intervalId = setInterval(() => {
          if (this.milliseconds > 0) {
            this.$store.commit('TICK_STOPPER', this.owner)
          } else {
            clearInterval(this.intervalId)
          }
        }, 1000)
      } else {
        clearInterval(this.intervalId)
        // if (this.$store.state.game.time.additional) {
        //   this.$store.commit('ADD_TIME_TO_STOPPER', this.owner)
        // }
      }
    }
  },

  watch: {
    ticking: {
      handler () {
        this.tick()
      }
    }
  },

  created () {
    if (this.ticking) this.tick()
  },

  beforeDestroy () {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
</script>

<style lang="sass">
  .active-background
    background-color: rgba(1, 22, 39, 0.78)
</style>
