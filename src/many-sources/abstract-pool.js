const Stream = require('../stream');
const {VALUE, ERROR} = require('../constants');
const {inherit} = require('../utils/objects');
const {concat, forEach, findByPred, find, remove, cloneArray} = require('../utils/collections');

const id = (x => x);

function AbstractPool({queueLim = 0, concurLim = -1, drop = 'new'} = {}) {
  Stream.call(this);

  this._queueLim = queueLim;
  this._concurLim = concurLim;
  this._drop = drop;

  if (this._concurLim === 0) {
    throw new Error('options.concurLim can\'t be 0');
  }

  this._queue = [];
  this._curSources = [];
  this._$handleSubAny = (event) => this._handleSubAny(event);
  this._$endHandlers = [];
}

inherit(AbstractPool, Stream, {

  _name: 'abstractPool',

  _add(obj, toObs /* Function | falsey */) {
    toObs = toObs || id;
    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
      this._addToCur(toObs(obj));
    } else {
      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
        this._addToQueue(toObs(obj));
      } else if (this._drop === 'old') {
        this._removeOldest();
        this._add(obj, toObs);
      }
    }
  },

  _addAll(obss) {
    forEach(obss, (obs) => this._add(obs));
  },

  _remove(obs) {
    if (this._removeCur(obs) === -1) {
      this._removeQueue(obs);
    }
  },

  _addToQueue(obs) {
    this._queue = concat(this._queue, [obs]);
  },

  _addToCur(obs) {
    this._curSources = concat(this._curSources, [obs]);
    if (this._active) {
      this._subscribe(obs);
    }
  },

  _subscribe(obs) {
    let onEnd = () => this._removeCur(obs);
    this._$endHandlers.push({obs: obs, handler: onEnd});

    obs.onAny(this._$handleSubAny);

    // it can become inactive in responce of subscribing to `obs.onAny` above
    if (this._active) {
      obs.onEnd(onEnd);
    }
  },

  _unsubscribe(obs) {
    obs.offAny(this._$handleSubAny);

    let onEndI = findByPred(this._$endHandlers, (obj) => obj.obs === obs);
    if (onEndI !== -1) {
      obs.offEnd(this._$endHandlers[onEndI].handler);
      this._$endHandlers.splice(onEndI, 1);
    }
  },

  _handleSubAny(event) {
    if (event.type === VALUE || event.type === ERROR) {
      this._send(event.type, event.value);
    }
  },

  _removeQueue(obs) {
    let index = find(this._queue, obs);
    this._queue = remove(this._queue, index);
    return index;
  },

  _removeCur(obs) {
    if (this._active) {
      this._unsubscribe(obs);
    }
    let index = find(this._curSources, obs);
    this._curSources = remove(this._curSources, index);
    if (index !== -1) {
      if (this._queue.length !== 0) {
        this._pullQueue();
      } else if (this._curSources.length === 0) {
        this._onEmpty();
      }
    }
    return index;
  },

  _removeOldest() {
    this._removeCur(this._curSources[0]);
  },

  _pullQueue() {
    if (this._queue.length !== 0) {
      this._queue = cloneArray(this._queue);
      this._addToCur(this._queue.shift());
    }
  },

  _onActivation() {
    for (let i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
      this._subscribe(sources[i]);
    }
  },

  _onDeactivation() {
    for (let i = 0, sources = this._curSources; i < sources.length; i++) {
      this._unsubscribe(sources[i]);
    }
  },

  _isEmpty() {
    return this._curSources.length === 0;
  },

  _onEmpty() {},

  _clear() {
    Stream.prototype._clear.call(this);
    this._queue = null;
    this._curSources = null;
    this._$handleSubAny = null;
    this._$endHandlers = null;
  }

});

module.exports = AbstractPool;
