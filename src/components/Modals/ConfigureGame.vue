<template lang="pug">
v-dialog(v-model="show" persistent width="500")
  v-btn.ma-0(slot="activator" color="primary" large) {{ $t('createGame') }}
  v-card(color="babyPowder")
    v-card-title.headline.primary.babyPowder--text {{ $t('configureGame') }}
    v-divider
    v-card-text.pa-0
      v-container.pb-0(grid-list-md)
        v-layout(wrap)
          v-flex(xs12)
            v-subheader.pl-0 {{ $t('preferredColor') }}
            v-radio-group(v-model="color" row)
              v-radio(:label="$t('black')" value="black")
              v-radio(:label="$t('white')" value="white")
              v-radio(:label="$t('random')" value="random")
          v-flex(xs12)
            v-subheader.pl-0 {{ $t('timeControl') }}
            v-tabs(v-model="tab" color="transparent" grow)
              v-tabs-slider(color="transparent")
              v-tab(active-class="time-control-active" ripple) {{ $t('standard') }}
              v-tab(active-class="time-control-active" ripple) {{ $t('custom') }}
              v-tab-item
                v-container.py-1(align-center justify-center fill-height)
                  v-layout(row wrap)
                    v-flex(xs12)
                      v-radio-group(:value="time" @change="setTime" column)
                        v-radio(label="Bullet (1+0)" value="bullet" class="pb-3")
                        v-radio(label="Blitz (3+2)" value="blitz" class="pb-3")
                        v-radio(label="Rapid (10+0)" value="rapid" class="pb-3")
                        v-radio(label="Classical (15+15)" value="classical" class="pb-3")
              v-tab-item
                v-container.py-1(align-center justify-center fill-height)
                  v-layout(row wrap)
                    v-flex.pb-0(xs12)
                      v-subheader.pl-0 {{ $t('baseTime') }}
                      v-slider(v-model="baseTime"
                              thumb-label="always"
                              :min="1"
                              :max="120")
                    v-flex(xs12)
                      v-subheader.pl-0 {{ $t('additionalTime') }}
                      v-slider(v-model="additionalTime"
                              thumb-label="always"
                              :max="120")
    v-card-actions
      v-spacer
      v-btn(color="secondary" @click.native="show = false") {{ $t('cancel') }}
      v-btn(color="primary" @click="create")
        | {{ $t('letsGo') }}
        v-icon(right) arrow_right_alt
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      show: false,
      tab: 0,
      color: 'black',
      baseTime: 1,
      additionalTime: 0
    }
  },

  computed: {
    ...mapGetters({
      roomId: 'GET_ROOMID'
    }),
    time () {
      if (this.baseTime === 1 && this.additionalTime === 0) return 'bullet'
      if (this.baseTime === 3 && this.additionalTime === 2) return 'blitz'
      if (this.baseTime === 10 && this.additionalTime === 0) return 'rapid'
      if (this.baseTime === 15 && this.additionalTime === 15) return 'classical'
    }
  },

  methods: {
    setTime (type) {
      switch (type) {
        case 'bullet':
          this.baseTime = 1
          this.additionalTime = 0
          break
        case 'blitz':
          this.baseTime = 3
          this.additionalTime = 2
          break
        case 'rapid':
          this.baseTime = 10
          this.additionalTime = 0
          break
        case 'classical':
          this.baseTime = 15
          this.additionalTime = 15
          break
      }
    },

    create () {
      this.$socket.sendObj(
        {
          type: 'createGame',
          payload: {
            color: this.color,
            baseTime: this.baseTime,
            additionalTime: this.additionalTime
          }
        }
      )
    }
  },

  watch: {
    roomId: function () {
      this.show = false
      this.$router.push({ name: 'game', params: { roomId: this.roomId } })
    }
  }
}
</script>

<style lang="sass">
.time-control-active
  background-color: #011627
  color: white
  opacity: 1 !important
</style>
