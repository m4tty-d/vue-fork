import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
    game: {
      roomId: ''
    }
  },
  getters: {
    GET_ROOMID (state) {
      return state.game.roomId
    }
  },
  mutations: {
    SOCKET_ONOPEN (state) {
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR () {
      console.log('Socket error')
    },
    SOCKET_ONMESSAGE (state, message) {
      switch (message.type) {
        case 'gameCreated':
          state.game.roomId = message.payload
          break
      }
      console.log(message)
    },
    SOCKET_RECONNECT () {
      console.log('Socket reconnected')
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    }
  },
  actions: {

  }
})
