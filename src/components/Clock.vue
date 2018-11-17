<template lang="pug">
v-card
  v-card-title
    .display-2.font-weight-light {{ getMinutesAndSeconds }}
    .headline {{ getMilliseconds }}
</template>

<script>
import moment from 'moment'

export default {
  props: {
    base: {
      type: Number,
      required: true
    },
    additional: {
      type: Number
    },
    ticking: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    getMinutesAndSeconds () {
      return moment.utc(this.seconds.asMilliseconds()).format('mm:ss')
    },
    getMilliseconds () {
      return moment.utc(this.seconds.asMilliseconds()).format(':SS')
    }
  },

  data () {
    return {
      seconds: null,
      timer: null,
      interval: null
    }
  },

  methods: {
    tick () {
      if (this.ticking) {
        this.interval = setInterval(() => {
          if (this.seconds.as('seconds') > 0) {
            this.seconds.subtract(moment.duration(10, 'ms'))
          } else {
            clearInterval(this.interval)
          }
        }, 10)
      } else {
        clearInterval(this.interval)
        if (this.additional) {
          this.seconds.add(moment.duration(this.additional, 's'))
        }
      }
    }
  },

  watch: {
    ticking: {
      handler () {
        this.tick()
      }
    },
    base: {
      handler () {
        this.seconds = moment.duration(this.base, 'minutes')
      }
    }
  },

  created () {
    this.seconds = moment.duration(this.base, 'minutes')
    if (this.ticking) this.tick()
  }
}
</script>
