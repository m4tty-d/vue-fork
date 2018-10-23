import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './plugins/plugins'
import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false
Vue.use(VueNativeSock, process.env.VUE_APP_WS_SERVER, {
  reconnection: true,
  store,
  format: 'json'
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
