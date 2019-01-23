import {inherit} from '../utils/objects'
import {Combine, handleCombineParameters} from './combine'
import {BatchingQueueSingleton} from '../dispatcher'

function CombineBatched(active, passive, combinator) {
  Combine.call(this, active, passive, combinator)
}

inherit(CombineBatched, Combine, {
  _isQueued: false,

  _emitQueued() {
    this._isQueued = false

    Combine.prototype._emitIfFull.call(this)
  },

  _emitCombined() {
    if (!this._isQueued) {
      this._isQueued = true

      BatchingQueueSingleton.push(this)
    }
  },
})

export default function combineBatched(active, passive, combinator) {
  return handleCombineParameters(active, passive, combinator, CombineBatched)
}
