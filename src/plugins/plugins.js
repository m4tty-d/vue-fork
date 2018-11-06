import Vue from 'vue'
import store from '@/store'
import './vuetify'
import VueNativeSock from 'vue-native-websocket'
import * as ModalDialogs from 'vue-modal-dialogs'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueNativeSock, process.env.VUE_APP_WS_SERVER, {
  reconnection: true,
  store,
  format: 'json'
})

Vue.use(ModalDialogs)
Vue.use(VueClipboard)
