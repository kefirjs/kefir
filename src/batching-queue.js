export default function BatchingQueue() {
  this.lockCounter = 0
  this.batched = undefined

  this.lock = function() {
    this.lockCounter++
  }

  this.release = function() {
    this.lockCounter--

    if (this.lockCounter === 0 && this.batched) {
      this.flushBatchingQueue()
    }
  }

  this.push = function(node) {
    if (!this.lockCounter) {
      node._emitQueued()
    } else {
      if (this.batched) {
        this.batched.push(node)
      } else {
        this.batched = [node]
      }
    }
  }

  this.flushBatchingQueue = function() {
    let batchedNode
    while ((batchedNode = this.batched.shift())) {
      batchedNode._emitQueued()
    }
  }
}
