import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import Chess from 'chess.js'
import moment from 'moment'

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
    drawOffered: false,
    result: '',
    repr: null
  },
  stopper: {
    player: 0,
    opponent: 0
  },
  scores: {
    player: 0,
    opponent: 0
  }
}

export default new Vuex.Store({
  state: _clone(baseState),
  getters: {},
  mutations: {
    CHANGE_TURN (state, turn) {
      state.game.turn = turn
    },
    ADD_MOVE_TO_HISTORY (state, move) {
      state.game.history.push(move)
    },
    SET_STOPPER (state, time) {
      state.stopper.player = moment.duration(time, 'minutes').asMilliseconds()
      state.stopper.opponent = moment.duration(time, 'minutes').asMilliseconds()
    },
    TICK_STOPPER (state, owner) {
      state.stopper[owner] = state.stopper[owner] - 1000
    },
    ADD_TIME_TO_STOPPER (state, owner) {
      const additional = state.game.time.additional
      state.stopper[owner] += additional * 1000
    },

    RESET_STATE (state) {
      state = _clone(baseState)
    }
  },
  actions: {
    SOCKET_ONOPEN ({ state }) {
      state.socket.isConnected = true
      console.log('Socket connected')

      setTimeout(() => {
        if (!state.player.id && router.currentRoute.name === 'game') {
          const roomId = router.currentRoute.params.roomId

          if (!state.player.isInitiator && roomId) {
            state.game.id = roomId
            this.$socket.sendObj({
              type: 'joinGame',
              payload: JSON.stringify({
                roomId
              })
            })
          }
        }
      }, 200)
    },
    SOCKET_ONCLOSE ({ state }) {
      state.socket.isConnected = false
      console.log('Socket closed')
    },
    SOCKET_ONERROR () {
      console.log('Socket error')
    },
    SOCKET_ONMESSAGE ({ state, commit }, message) {
      switch (message.type) {
        case 'roomCreated':
          console.log('ROOM CREATED!!!')
          state.game.id = message.payload.roomId
          state.game.time.base = message.payload.baseTime
          state.game.time.additional = message.payload.additionalTime

          commit('SET_STOPPER', state.game.time.base)

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
          break
        case 'roomJoined':
          console.log('ROOM JOINED!!!')
          Vue.set(state.game.time, 'base', message.payload.baseTime)
          Vue.set(
            state.game.time,
            'additional',
            message.payload.additionalTime
          )
          commit('SET_STOPPER', message.payload.baseTime)
          break
        case 'gameCanStart':
          console.log('GAME CAN START!!!')
          state.game.canStart = true
          break
        case 'move':
          console.log('MOVE!!!')
          state.game.history.push(message.payload.move)
          state.game.fen = message.payload.fen
          state.game.lastMove = message.payload.move
          state.game.turn = state.game.turn === 'white' ? 'black' : 'white'
          state.game.isRunning = true

          state.stopper.player = message.payload.playerSeconds * 1000
          state.stopper.opponent = message.payload.opponentSeconds * 1000
          break
        case 'drawOffered':
          state.game.drawOffered = true
          break
        case 'rematch':
          state.game.history = []
          state.game.fen = ''
          state.game.lastMove = ''
          state.game.turn = 'white'
          state.game.isRunning = false
          state.game.canStart = true
          state.game.result = ''
          state.game.repr = new Chess()

          state.scores.player = message.payload.playerScore
          state.scores.opponent = message.payload.opponentScore

          commit('SET_STOPPER', state.game.time.base)

          state.player.color = state.player.color === 'white' ? 'black' : 'white'
          break
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
    SOCKET_RECONNECT_ERROR ({ state }) {
      state.socket.reconnectError = true
    }
  }
})
