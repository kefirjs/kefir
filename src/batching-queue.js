export default function BatchingQueue() {
  this.lockCounter = 0
  this.batchingQueue = []

  this.lock = function() {
    this.lockCounter++
  }

  this.release = function() {
    this.lockCounter--

    if (this.lockCounter === 0 && this.batchingQueue.length > 0) {
      this.flushBatchingQueue()
    }
  }

  this.push = function(node) {
    if (!this.lockCounter) {
      batchedNode._emitQueued()
    }
    this.batchingQueue.push(node)
  }

  this.flushBatchingQueue = function() {
    let batchedNode
    while ((batchedNode = this.batchingQueue.shift())) {
      batchedNode._emitQueued()
    }
  }
}
