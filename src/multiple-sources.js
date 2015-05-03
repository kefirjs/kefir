const Stream = require('./stream');
const {VALUE, ERROR, END, NOTHING} = require('./constants');
const {inherit, extend, get} = require('./utils/objects');
const {forEach, concat, findByPred, find, remove, cloneArray, fillArray, map} = require('./utils/collections');
const {spread} = require('./utils/functions');
const {isArray} = require('./utils/types');
const {neverInstance} = require('./primary');


function id (x) {return x;}


function _AbstractPool(options) {
  Stream.call(this);

  this._queueLim = get(options, 'queueLim', 0);
  this._concurLim = get(options, 'concurLim', -1);
  this._drop = get(options, 'drop', 'new');
  if (this._concurLim === 0) {
    throw new Error('options.concurLim can\'t be 0');
  }

  let $ = this;
  this._$handleSubAny = function(event) {
    $._handleSubAny(event);
  };

  this._queue = [];
  this._curSources = [];
  this._activating = false;

  this._bindedEndHandlers = [];
}

inherit(_AbstractPool, Stream, {

  _name: 'abstractPool',

  _add(obj, toObs) {
    toObs = toObs || id;
    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
      this._addToCur(toObs(obj));
    } else {
      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
        this._addToQueue(toObs(obj));
      } else if (this._drop === 'old') {
        this._removeOldest();
        this._add(toObs(obj));
      }
    }
  },
  _addAll(obss) {
    let $ = this;
    forEach(obss, function(obs) {
      $._add(obs);
    });
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
    let $ = this;

    let onEnd = function() {
      $._removeCur(obs);
    };

    this._bindedEndHandlers.push({obs: obs, handler: onEnd});

    obs.onAny(this._$handleSubAny);

    // it can become inactive in responce of subscribing to `obs.onAny` above
    if (this._active) {
      obs.onEnd(onEnd);
    }
  },
  _unsubscribe(obs) {
    obs.offAny(this._$handleSubAny);

    let onEndI = findByPred(this._bindedEndHandlers, function(obj) {
      return obj.obs === obs;
    });
    if (onEndI !== -1) {
      let onEnd = this._bindedEndHandlers[onEndI].handler;
      this._bindedEndHandlers.splice(onEndI, 1);
      obs.offEnd(onEnd);
    }
  },
  _handleSubAny(event) {
    if (event.type === VALUE || event.type === ERROR) {
      this._send(event.type, event.value, event.current && this._activating);
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
    let sources = this._curSources
      , i;
    this._activating = true;
    for (i = 0; i < sources.length; i++) {
      if (this._active) {
        this._subscribe(sources[i]);
      }
    }
    this._activating = false;
  },
  _onDeactivation() {
    let sources = this._curSources
      , i;
    for (i = 0; i < sources.length; i++) {
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
    this._bindedEndHandlers = null;
  }

});





// .merge()

let MergeLike = {
  _onEmpty() {
    if (this._initialised) {
      this._send(END, null, this._activating);
    }
  }
};

function Merge(sources) {
  _AbstractPool.call(this);
  if (sources.length === 0) {
    this._send(END);
  } else {
    this._addAll(sources);
  }
  this._initialised = true;
}

inherit(Merge, _AbstractPool, extend({_name: 'merge'}, MergeLike));






// .concat()

function Concat(sources) {
  _AbstractPool.call(this, {concurLim: 1, queueLim: -1});
  if (sources.length === 0) {
    this._send(END);
  } else {
    this._addAll(sources);
  }
  this._initialised = true;
}

inherit(Concat, _AbstractPool, extend({_name: 'concat'}, MergeLike));







// .pool()

function Pool() {
  _AbstractPool.call(this);
}

inherit(Pool, _AbstractPool, {

  _name: 'pool',

  plug(obs) {
    this._add(obs);
    return this;
  },
  unplug(obs) {
    this._remove(obs);
    return this;
  }

});







// .bus()

function Bus() {
  _AbstractPool.call(this);
}

inherit(Bus, _AbstractPool, {

  _name: 'bus',

  plug(obs) {
    this._add(obs);
    return this;
  },
  unplug(obs) {
    this._remove(obs);
    return this;
  },

  emit(x) {
    this._send(VALUE, x);
    return this;
  },
  error(x) {
    this._send(ERROR, x);
    return this;
  },
  end() {
    this._send(END);
    return this;
  },
  emitEvent(event) {
    this._send(event.type, event.value);
  }

});







// .flatMap()

function FlatMap(source, fn, options) {
  _AbstractPool.call(this, options);
  this._source = source;
  this._fn = fn || id;
  this._mainEnded = false;
  this._lastCurrent = null;

  let $ = this;
  this._$handleMainSource = function(event) {
    $._handleMainSource(event);
  };
}

inherit(FlatMap, _AbstractPool, {

  _onActivation() {
    _AbstractPool.prototype._onActivation.call(this);
    if (this._active) {
      this._activating = true;
      this._source.onAny(this._$handleMainSource);
      this._activating = false;
    }
  },
  _onDeactivation() {
    _AbstractPool.prototype._onDeactivation.call(this);
    this._source.offAny(this._$handleMainSource);
  },

  _handleMainSource(event) {
    if (event.type === VALUE) {
      if (!event.current || this._lastCurrent !== event.value) {
        this._add(event.value, this._fn);
      }
      this._lastCurrent = event.value;
    }
    if (event.type === ERROR) {
      this._send(ERROR, event.value, event.current);
    }
    if (event.type === END) {
      if (this._isEmpty()) {
        this._send(END, null, event.current);
      } else {
        this._mainEnded = true;
      }
    }
  },

  _onEmpty() {
    if (this._mainEnded) {
      this._send(END);
    }
  },

  _clear() {
    _AbstractPool.prototype._clear.call(this);
    this._source = null;
    this._lastCurrent = null;
    this._$handleMainSource = null;
  }

});








// .zip()

function Zip(sources, combinator) {
  Stream.call(this);
  if (sources.length === 0) {
    this._send(END);
  } else {
    this._buffers = map(sources, function(source) {
      return isArray(source) ? cloneArray(source) : [];
    });
    this._sources = map(sources, function(source) {
      return isArray(source) ? neverInstance : source;
    });
    this._combinator = combinator ? spread(combinator, this._sources.length) : id;
    this._aliveCount = 0;

    this._bindedHandlers = Array(this._sources.length);
    for (let i = 0; i < this._sources.length; i++) {
      this._bindedHandlers[i] = this._bindHandleAny(i);
    }

  }
}


inherit(Zip, Stream, {

  _name: 'zip',

  _onActivation() {
    let i, length = this._sources.length;
    this._drainArrays();
    this._aliveCount = length;
    for (i = 0; i < length; i++) {
      if (this._active) {
        this._sources[i].onAny(this._bindedHandlers[i]);
      }
    }
  },

  _onDeactivation() {
    for (let i = 0; i < this._sources.length; i++) {
      this._sources[i].offAny(this._bindedHandlers[i]);
    }
  },

  _emit(isCurrent) {
    let values = new Array(this._buffers.length);
    for (let i = 0; i < this._buffers.length; i++) {
      values[i] = this._buffers[i].shift();
    }
    this._send(VALUE, this._combinator(values), isCurrent);
  },

  _isFull() {
    for (let i = 0; i < this._buffers.length; i++) {
      if (this._buffers[i].length === 0) {
        return false;
      }
    }
    return true;
  },

  _emitIfFull(isCurrent) {
    if (this._isFull()) {
      this._emit(isCurrent);
    }
  },

  _drainArrays() {
    while (this._isFull()) {
      this._emit(true);
    }
  },

  _bindHandleAny(i) {
    let $ = this;
    return function(event) {
      $._handleAny(i, event);
    };
  },

  _handleAny(i, event) {
    if (event.type === VALUE) {
      this._buffers[i].push(event.value);
      this._emitIfFull(event.current);
    }
    if (event.type === ERROR) {
      this._send(ERROR, event.value, event.current);
    }
    if (event.type === END) {
      this._aliveCount--;
      if (this._aliveCount === 0) {
        this._send(END, null, event.current);
      }
    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._buffers = null;
    this._combinator = null;
    this._bindedHandlers = null;
  }

});








// .combine()

function defaultErrorsCombinator(errors) {
  let latestError;
  for (let i = 0; i < errors.length; i++) {
    if (errors[i] !== undefined) {
      if (latestError === undefined || latestError.index < errors[i].index) {
        latestError = errors[i];
      }
    }
  }
  return latestError.error;
}

function Combine(active, passive, combinator) {
  Stream.call(this);
  if (active.length === 0) {
    this._send(END);
  } else {
    this._activeCount = active.length;
    this._sources = concat(active, passive);
    this._combinator = combinator ? spread(combinator, this._sources.length) : id;
    this._aliveCount = 0;
    this._latestValues = new Array(this._sources.length);
    this._latestErrors = new Array(this._sources.length);
    fillArray(this._latestValues, NOTHING);
    this._activating = false;
    this._emitAfterActivation = false;
    this._endAfterActivation = false;
    this._latestErrorIndex = 0;

    this._bindedHandlers = Array(this._sources.length);
    for (let i = 0; i < this._sources.length; i++) {
      this._bindedHandlers[i] = this._bindHandleAny(i);
    }

  }
}


inherit(Combine, Stream, {

  _name: 'combine',

  _onActivation() {
    let length = this._sources.length,
        i;
    this._aliveCount = this._activeCount;
    this._activating = true;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny(this._bindedHandlers[i]);
    }
    this._activating = false;
    if (this._emitAfterActivation) {
      this._emitAfterActivation = false;
      this._emitIfFull(true);
    }
    if (this._endAfterActivation) {
      this._send(END, null, true);
    }
  },

  _onDeactivation() {
    let length = this._sources.length,
        i;
    for (i = 0; i < length; i++) {
      this._sources[i].offAny(this._bindedHandlers[i]);
    }
  },

  _emitIfFull(isCurrent) {
    let hasAllValues = true;
    let hasErrors = false;
    let length = this._latestValues.length;
    let valuesCopy = new Array(length);
    let errorsCopy = new Array(length);;

    for (let i = 0; i < length; i++) {
      valuesCopy[i] = this._latestValues[i];
      errorsCopy[i] = this._latestErrors[i];

      if (valuesCopy[i] === NOTHING) {
        hasAllValues = false;
      }

      if (errorsCopy[i] !== undefined) {
        hasErrors = true;
      }
    }

    if (hasAllValues) {
      this._send(VALUE, this._combinator(valuesCopy), isCurrent);
    }
    if (hasErrors) {
      this._send(ERROR, defaultErrorsCombinator(errorsCopy), isCurrent);
    }
  },

  _bindHandleAny(i) {
    let $ = this;
    return function(event) {
      $._handleAny(i, event);
    };
  },

  _handleAny(i, event) {

    if (event.type === VALUE || event.type === ERROR) {

      if (event.type === VALUE) {
        this._latestValues[i] = event.value;
        this._latestErrors[i] = undefined;
      }
      if (event.type === ERROR) {
        this._latestValues[i] = NOTHING;
        this._latestErrors[i] = {
          index: this._latestErrorIndex++,
          error: event.value
        };
      }

      if (i < this._activeCount) {
        if (this._activating) {
          this._emitAfterActivation = true;
        } else {
          this._emitIfFull(event.current);
        }
      }

    } else { // END

      if (i < this._activeCount) {
        this._aliveCount--;
        if (this._aliveCount === 0) {
          if (this._activating) {
            this._endAfterActivation = true;
          } else {
            this._send(END, null, event.current);
          }
        }
      }

    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._latestValues = null;
    this._latestErrors = null;
    this._combinator = null;
    this._bindedHandlers = null;
  }

});



module.exports = {Merge, Concat, Pool, Bus, FlatMap, Zip, Combine};
