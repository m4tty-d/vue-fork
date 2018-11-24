<template lang="pug">
.blue.merida
  .cg-board-wrap(ref="board")
</template>

<script>
import Chess from 'chess.js'
import { Chessground } from 'chessground'
import '@/styles/chessboard.css'
import debounce from 'lodash.debounce'

export default {
  props: {
    orientation: {
      type: String,
      default: 'white'
    },
    fen: {
      type: String
    },
    onPromotion: {
      type: Function
    }
  },

  data () {
    return {
      game: null,
      board: null,
      promotions: [],
      promoteTo: 'q'
    }
  },

  methods: {
    turnColor () {
      return this.game.turn() === 'w' ? 'white' : 'black'
    },

    possibleMoves () {
      const dests = {}
      this.game.SQUARES.forEach(s => {
        const ms = this.game.moves({ square: s, verbose: true })
        if (ms.length) dests[s] = ms.map(m => m.to)
      })
      return dests
    },

    calculatePromotions () {
      let moves = this.game.moves({ verbose: true })
      this.promotions = []
      for (let move of moves) {
        if (move.promotion) {
          this.promotions.push(move)
        }
      }
    },

    isPromotion (orig, dest) {
      let filteredPromotions = this.promotions.filter(move => move.from === orig && move.to === dest)
      return filteredPromotions.length > 0
    },

    changeTurn () {
      return (orig, dest, metadata) => {
        if (this.isPromotion(orig, dest)) {
          this.promoteTo = this.onPromotion()
        }
        this.game.move({ from: orig, to: dest, promotion: this.promoteTo })
        this.board.set({
          fen: this.game.fen(),
          turnColor: this.turnColor(),
          movable: {
            color: this.orientation,
            dests: this.possibleMoves()
          }
        })
        this.calculatePromotions()
        this.afterMove()
      }
    },

    afterMove () {
      this.$emit('onMove', {
        history: this.game.history(),
        fen: this.game.fen(),
        turn: this.turnColor()
      })
    },

    setBoard () {
      this.board = Chessground(this.$refs.board, {
        fen: this.game.fen(),
        turnColor: this.turnColor(),
        orientation: this.orientation,
        resizable: true,
        movable: {
          color: this.orientation,
          dests: this.possibleMoves()
        }
      })

      this.board.set({
        movable: { events: { after: this.changeTurn() } }
      })
    },

    onWindowResize (event) {
      console.log('asdf')
      document.body.dispatchEvent(new Event('chessground.resize'))
    }
  },

  watch: {
    orientation: {
      handler () {
        this.setBoard()
      }
    },
    fen: {
      handler () {
        this.game.move(this.$store.state.game.lastMove)
        this.board.set({
          fen: this.game.fen(),
          turnColor: this.turnColor(),
          movable: {
            color: this.orientation,
            dests: this.possibleMoves()
          }
        })
      }
    }
  },

  mounted () {
    this.setBoard()

    window.addEventListener('resize', debounce(this.onWindowResize, 250))
  },

  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.onWindowResize, 250))
  },

  created () {
    this.game = new Chess()
    this.board = null
  }
}
</script>
