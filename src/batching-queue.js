export default function BatchingQueue() {
  this.lockCounter = 0
  this.batchingQueue = undefined

  this.lock = function() {
    this.lockCounter++
  }

  this.release = function() {
    this.lockCounter--

    if (this.lockCounter === 0 && this.batchingQueue) {
      this.flushBatchingQueue()
    }
  }

  this.push = function(node) {
    if (!this.lockCounter) {
      node._emitQueued()
    } else {
      if (this.batchingQueue) {
        this.batchingQueue.push(node);
      } else {
        this.batchingQueue = [node];
      }
    }
  }

  this.flushBatchingQueue = function() {
    let batchedNode
    while ((batchedNode = this.batchingQueue.shift())) {
      batchedNode._emitQueued()
    }
  }
}
