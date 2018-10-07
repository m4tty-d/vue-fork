<template lang="pug">
v-container(class="home-jumbo" fill-height fluid)
  v-container
    v-layout(align-center)
      v-flex
        .display-4.home-jumbo-title FORK
        .subheading.home-jumbo-subtitle.mt-2 {{ $t('motto') }}
        .display-1.font-weight-bold.home-question.mt-4.mb-5 {{ $t('areYouReady') }}
        configure-game-modal.home-jumbo-action
        v-btn(:to="{name: 'watch'}" flat large) {{ $t('watchOthers') }}
</template>

<script>
import ConfigureGameModal from '@/components/Modals/ConfigureGame.vue'

export default {
  components: {
    ConfigureGameModal
  }
}
</script>

<style lang="sass" scoped>
.home-jumbo
  background: #2EC4B6;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #2EC4B6, #FDFFFC);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #2EC4B6, #FDFFFC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: #FDFFFC

  &-title
    margin-left: -8px
</style>
