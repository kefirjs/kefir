import {inherit} from './utils/objects'
import Observable from './observable'

function Stream(batchingQueue) {
  Observable.call(this, batchingQueue)
}

inherit(Stream, Observable, {
  _name: 'stream',

  getType() {
    return 'stream'
  },
})

export default Stream
