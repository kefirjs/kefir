import {extend} from './utils/objects'
import {VALUE, ERROR, ANY} from './constants'
import {concat, find, findByPred, remove, contains} from './utils/collections'

function callSubscriber(type, fn, event) {
  if (type === ANY) {
    fn(event)
  } else if (type === event.type) {
    if (type === VALUE || type === ERROR) {
      fn(event.value)
    } else {
      fn()
    }
  }
}

const IE10Map = function() {
  this.list = []
  this.has = function(item) {
    return find(this.list, item) !== -1
  }
  this.set = function(item) {
    return this.list.push(item)
  }
  this.delete = function(item) {
    this.list = remove(this.list, find(this.list, item))
  }
}

let globalDispatcherLoopCounter = 0
let atomicMap = typeof Map !== 'undefined' ? new Map() : new IE10Map()
let atomicQueue = []

export let atomicQueuePush = function(node) {
  // do not allow calling same effect twice
  if (!atomicMap.has(node)) {
    atomicMap.set(node, 1)
    atomicQueue.push(arguments)
  }
}

function Dispatcher() {
  this._items = []
  this._spies = []
  this._inLoop = 0
  this._removedItems = null
}

extend(Dispatcher.prototype, {
  add(type, fn) {
    this._items = concat(this._items, [{type, fn}])
    return this._items.length
  },

  remove(type, fn) {
    const index = findByPred(this._items, x => x.type === type && x.fn === fn)

    // if we're currently in a notification loop,
    // remember this subscriber was removed
    if (this._inLoop !== 0 && index !== -1) {
      if (this._removedItems === null) {
        this._removedItems = []
      }
      this._removedItems.push(this._items[index])
    }

    this._items = remove(this._items, index)
    return this._items.length
  },

  addSpy(fn) {
    this._spies = concat(this._spies, [fn])
    return this._spies.length
  },

  // Because spies are only ever a function that perform logging as
  // their only side effect, we don't need the same complicated
  // removal logic like in remove()
  removeSpy(fn) {
    this._spies = remove(this._spies, this._spies.indexOf(fn))
    return this._spies.length
  },

  dispatch(event) {
    globalDispatcherLoopCounter++
    this._inLoop++
    for (let i = 0, spies = this._spies; this._spies !== null && i < spies.length; i++) {
      spies[i](event)
    }

    for (let i = 0, items = this._items; i < items.length; i++) {
      // cleanup was called
      if (this._items === null) {
        break
      }

      // this subscriber was removed
      if (this._removedItems !== null && contains(this._removedItems, items[i])) {
        continue
      }
      callSubscriber(items[i].type, items[i].fn, event)
    }
    this._inLoop--
    globalDispatcherLoopCounter--

    if (this._inLoop === 0) {
      this._removedItems = null
    }
    if (globalDispatcherLoopCounter === 0 && atomicQueue.length > 0) {
      let args
      while ((args = atomicQueue.shift())) {
        atomicMap.delete(args[0])
        args[1].call(args[0])
      }
    }
  },

  cleanup() {
    this._items = null
    this._spies = null
  },
})

export {callSubscriber, Dispatcher}
