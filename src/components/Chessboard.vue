<template lang="pug">
.blue.merida
  .cg-board-wrap(ref="board")
</template>

<script>
import Chess from 'chess.js'
import { Chessground } from 'chessground'
import '@/styles/chessboard.css'
import debounce from 'lodash.debounce'
import { mapState } from 'vuex'

export default {
  props: {
    orientation: {
      type: String,
      default: 'white'
    },
    move: {
      type: String
    },
    onPromotion: {
      type: Function
    }
  },

  data () {
    return {
      board: null,
      promotions: [],
      promoteTo: 'q'
    }
  },

  computed: {
    ...mapState([
      'game'
    ])
  },

  methods: {
    turnColor () {
      return this.game.repr.turn() === 'w' ? 'white' : 'black'
    },

    possibleMoves () {
      const dests = {}
      this.game.repr.SQUARES.forEach(s => {
        const ms = this.game.repr.moves({ square: s, verbose: true })
        if (ms.length) dests[s] = ms.map(m => m.to)
      })
      return dests
    },

    calculatePromotions () {
      let moves = this.game.repr.moves({ verbose: true })
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

    isMoveCorrect (orig, dest) {
      const possibleMoves = this.possibleMoves()
      return possibleMoves[orig] && possibleMoves[orig].includes(dest)
    },

    handleMove () {
      return (orig, dest, metadata) => {
        if (this.isMoveCorrect(orig, dest)) {
          this.game.repr.move({ from: orig, to: dest, promotion: this.promoteTo })

          if (this.isPromotion(orig, dest)) {
            this.promoteTo = this.onPromotion()
          }

          this.calculatePromotions()

          this.$emit('onMove', {
            history: this.game.repr.history(),
            fen: this.game.repr.fen(),
            turn: this.turnColor()
          })
        }

        this.board.set({
          fen: this.game.repr.fen(),
          turnColor: this.turnColor(),
          movable: {
            color: this.orientation,
            dests: this.possibleMoves()
          }
        })
      }
    },

    setBoard () {
      this.board = Chessground(this.$refs.board, {
        fen: this.game.repr.fen(),
        turnColor: this.turnColor(),
        orientation: this.orientation,
        resizable: true,
        movable: {
          color: this.orientation,
          dests: this.possibleMoves()
        }
      })

      this.board.set({
        movable: { events: { after: this.handleMove() } }
      })
    },

    onWindowResize (event) {
      document.body.dispatchEvent(new Event('chessground.resize'))
    }
  },

  watch: {
    orientation: {
      handler () {
        this.setBoard()
      }
    },
    move: {
      handler () {
        this.game.repr.move(this.move)
        this.board.set({
          fen: this.game.repr.fen(),
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
    this.game.repr = new Chess()
    this.board = null
  }
}
</script>
