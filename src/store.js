import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

const _clone = v => JSON.parse(JSON.stringify(v))

const baseState = {
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
    canStart: false,
    fen: '',
    lastMove: '',
    history: [],
    turn: 'white',
    isRunning: false,
    result: ''
  }
}

export default new Vuex.Store({
  state: _clone(baseState),
  getters: {},
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
            router.push({
              name: 'game',
              params: {
                roomId: state.game.id
              }
            })
          }
          localStorage.setItem('playerId', state.player.id)
          // localStorage.setItem('playerColor', state.player.color)
          break
        case 'roomJoined':
          console.log('ROOM JOINED!!!')
          Vue.set(state.game.time, 'base', message.payload.baseTime)
          Vue.set(
            state.game.time,
            'additional',
            message.payload.additionalTime
          )
          // state.game.time.base = message.payload.baseTime
          // state.game.time.additional = message.payload.additionalTime
          break
        case 'gameCanStart':
          console.log('GAME CAN START!!!')
          state.game.canStart = true
          break
        case 'move':
          console.log('MOVE!!!')
          console.log(message.payload)
          state.game.history.push(message.payload.move)
          state.game.fen = message.payload.fen
          state.game.lastMove = message.payload.move
          state.game.turn = state.game.turn === 'white' ? 'black' : 'white'
          state.game.isRunning = state.game.isRunning || true
          break
        // case 'clock':
        // console.log('myClock: ' + JSON.stringify(message.payload))
        // break
        // case 'enemyClock':
        // console.log('enemyClock: ' + JSON.stringify(message.payload))
        // break
        case 'gameover':
          console.log('GAMEOVER!!!')
          console.log(message.payload)
          state.game.result = message.payload.result
          state.game.isRunning = false
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

    CHANGE_TURN (state, turn) {
      state.game.turn = turn
    },
    ADD_MOVE_TO_HISTORY (state, move) {
      state.game.history.push(move)
    },
    RESET (state) {
      for (let key in baseState) {
        state[key] = baseState[key]
      }
    }
  }
})
