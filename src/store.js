import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      reconnectError: false
    },
    player: {
      id: '',
      color: '',
      isInitiator: false
    },
    game: {
      id: '',
      time: {
        base: 0,
        additional: 0
      },
      canStart: false
    }
  },
  getters: {
    getBoardOrientation (state) {
      return state.player.color
    },
    getBaseTime (state) {
      return state.game.time.base
    },
    getAdditionalTime (state) {
      return state.game.time.additional
    },
    isPlayerInitiator (state) {
      return state.player.isInitiator
    },
    canGameStart (state) {
      return state.game.canStart
    }
  },
  mutations: {
    SOCKET_ONOPEN (state) {
      state.socket.isConnected = true
      console.log('Socket connected')
    },
    SOCKET_ONCLOSE (state) {
      state.socket.isConnected = false
      console.log('Socket closed')
    },
    SOCKET_ONERROR () {
      console.log('Socket error')
    },
    SOCKET_ONMESSAGE (state, message) {
      switch (message.type) {
        case 'roomCreated':
          console.log('ROOM CREATED!!!')
          state.game.id = message.payload.roomId
          state.game.time.base = message.payload.baseTime
          state.game.time.additional = message.payload.additionalTime
          state.player.isInitiator = true
          break
        case 'playerCreated':
          console.log('PLAYER CREATED!!!')
          state.player.id = message.payload.playerId
          state.player.color = message.payload.color
          if (state.player.isInitiator) {
            router.push({ name: 'game', params: { roomId: state.game.id } })
          }
          localStorage.setItem('playerId', state.player.id)
          // localStorage.setItem('playerColor', state.player.color)
          break
        case 'roomJoined':
          console.log('ROOM JOINED!!!')
          Vue.set(state.game.time, 'base', message.payload.baseTime)
          Vue.set(state.game.time, 'additional', message.payload.additionalTime)
          // state.game.time.base = message.payload.baseTime
          // state.game.time.additional = message.payload.additionalTime
          break
        case 'gameCanStart':
          console.log('GAME CAN START!!!')
          state.game.canStart = true
          break
        case 'error':
          console.log('Error!!! :', message.payload)
          break
      }
    },
    SOCKET_RECONNECT () {
      console.log('Socket reconnected')
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    },

    RESET (state) {
      state.player.id = ''
      state.player.color = ''
      state.game.id = ''
      state.time.base = 0
      state.time.additional = 0
    }
  }
})
