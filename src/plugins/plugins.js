import Vue from 'vue'
import store from '@/store'
import './vuetify'
import VueNativeSock from 'vue-native-websocket'
import * as ModalDialogs from 'vue-modal-dialogs'
import VueClipboard from 'vue-clipboard2'

const passToStoreHandler = function (eventName, event) {
  if (!eventName.startsWith('SOCKET_')) { return }
  let method = 'dispatch'
  let target = eventName.toUpperCase()
  let msg = event

  if (this.format === 'json' && event.data) {
    msg = JSON.parse(event.data)
  }

  this.store[method](target, msg)
}

Vue.use(VueNativeSock, process.env.VUE_APP_WS_SERVER, {
  reconnection: true,
  store,
  format: 'json',
  passToStoreHandler
})

Vue.use(ModalDialogs)
Vue.use(VueClipboard)
