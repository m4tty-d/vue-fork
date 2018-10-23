<template lang="pug">
v-card.notation-holder
  v-card-title
    div
      template(v-for="(move, index) in historySliced")
        span {{ `${index + 1}. ` }}
        template(v-for="(ply, plyIndex) in move")
          span {{ ply }}
          span(v-if="plyIndex != 1") {{ ' - '}}
        br
  v-card-actions
</template>

<script>
export default {
  props: {
    history: {
      type: Array
    }
  },

  computed: {
    historySliced () {
      return [].concat.apply([], this.history.map((ply, i) => {
        return i % 2 ? [] : [this.history.slice(i, i + 2)]
      }))
    }
  }
}
</script>

<style lang="sass">
.notation-holder
  height: 15rem
  overflow-y: scroll
  font-size: 1.25rem
</style>
