function _AbstractPool(options) {
  Stream.call(this);

  this._queueLim = get(options, 'queueLim', 0); // -1...∞
  this._concurLim = get(options, 'concurLim', -1); // -1, 1...∞
  this._drop = get(options, 'drop', 'new'); // old, new
  if (this._concurLim === 0) {
    throw new Error('options.concurLim can\'t be 0');
  }

  this._queue = [];
  this._curSources = [];
  this._activating = false;

}

inherit(_AbstractPool, Stream, {

  _name: 'abstractPool',

  _add: function(obs) {
    if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
      this._addToCur(obs);
    } else {
      if (this._queueLim === -1 || this._queue.length < this._queueLim) {
        this._addToQueue(obs);
      } else if (this._drop === 'old') {
        this._removeOldest();
        this._add(obs);
      }
    }
  },
  _addAll: function(obss) {
    var $ = this;
    forEach(obss, function(obs) {  $._add(obs)  });
  },
  _remove: function(obs) {
    if (this._removeCur(obs) === -1) {
      this._removeQueue(obs);
    }
  },

  _addToQueue: function(obs) {
    this._queue = concat(this._queue, [obs]);
  },
  _addToCur: function(obs) {
    this._curSources = concat(this._curSources, [obs]);
    if (this._active) {  this._sub(obs)  }
  },
  _sub: function(obs) {
    obs.onAny([this._handleSubAny, this]);
    obs.onEnd([this._removeCur, this, obs]);
  },
  _unsub: function(obs) {
    obs.offAny([this._handleSubAny, this]);
    obs.offEnd([this._removeCur, this, obs]);
  },
  _handleSubAny: function(event) {
    if (event.type === 'value') {
      this._send('value', event.value, event.current && this._activating);
    }
  },

  _removeQueue: function(obs) {
    var index = find(this._queue, obs);
    this._queue = remove(this._queue, index);
    return index;
  },
  _removeCur: function(obs) {
    if (this._active) {  this._unsub(obs)  }
    var index = find(this._curSources, obs);
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
  _removeOldest: function() {
    this._removeCur(this._curSources[0]);
  },

  _pullQueue: function() {
    if (this._queue.length !== 0) {
      this._queue = cloneArray(this._queue);
      this._addToCur(this._queue.shift());
    }
  },

  _onActivation: function() {
    var sources = this._curSources
      , i;
    this._activating = true;
    for (i = 0; i < sources.length; i++) {  this._sub(sources[i])  }
    this._activating = false;
  },
  _onDeactivation: function() {
    var sources = this._curSources
      , i;
    for (i = 0; i < sources.length; i++) {  this._unsub(sources[i])  }
  },

  _isEmpty: function() {  return this._curSources.length === 0  },
  _onEmpty: function() {},

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._queue = null;
    this._curSources = null;
  }

});





// .merge()

var MergeLike = {
  _onEmpty: function() {
    if (this._initialised) {  this._send('end', null, this._activating)  }
  }
};

function Merge(sources) {
  _AbstractPool.call(this);
  if (sources.length === 0) {  this._send('end')  } else {  this._addAll(sources)  }
  this._initialised = true;
}

inherit(Merge, _AbstractPool, extend({_name: 'merge'}, MergeLike));

Kefir.merge = function() {
  return new Merge(agrsToArray(arguments));
}

Observable.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
}




// .concat()

function Concat(sources) {
  _AbstractPool.call(this, {concurLim: 1, queueLim: -1});
  if (sources.length === 0) {  this._send('end')  } else {  this._addAll(sources)  }
  this._initialised = true;
}

inherit(Concat, _AbstractPool, extend({_name: 'concat'}, MergeLike));

Kefir.concat = function() {
  return new Concat(agrsToArray(arguments));
}

Observable.prototype.concat = function(other) {
  return Kefir.concat([this, other]);
}






// .pool()

function Pool() {
  _AbstractPool.call(this);
}

inherit(Pool, _AbstractPool, {

  _name: 'pool',

  add: function(obs) {
    this._add(obs);
    return this;
  },
  remove: function(obs) {
    this._remove(obs);
    return this;
  }

});

Kefir.pool = function() {
  return new Pool();
}





// .flatMap()

function FlatMap(source, fn, options) {
  _AbstractPool.call(this, options);
  this._source = source;
  this._fn = fn ? Fn(fn, 1) : null;
  this._mainEnded = false;
  this._lastCurrent = null;
  this.setName(source, 'flatMap');
}

inherit(FlatMap, _AbstractPool, {

  _onActivation: function() {
    _AbstractPool.prototype._onActivation.call(this);
    this._activating = true;
    this._source.onAny([this._handleMainSource, this]);
    this._activating = false;
  },
  _onDeactivation: function() {
    _AbstractPool.prototype._onDeactivation.call(this);
    this._source.offAny([this._handleMainSource, this]);
  },

  _handleMainSource: function(event) {
    if (event.type === 'value') {
      if (!event.current || this._lastCurrent !== event.value) {
        this._add(this._fn ? this._fn.invoke(event.value) : event.value);
      }
      this._lastCurrent = event.value;
    } else {
      if (this._isEmpty()) {
        this._send('end', null, event.current);
      } else {
        this._mainEnded = true;
      }
    }
  },

  _onEmpty: function() {
    if (this._mainEnded) {  this._send('end')  }
  },

  _clear: function() {
    _AbstractPool.prototype._clear.call(this);
    this._source = null;
    this._lastCurrent = null;
  }

});

Observable.prototype.flatMap = function(fn) {
  return new FlatMap(this, fn);
}





// .sampledBy()

function SampledBy(passive, active, combinator) {
  Stream.call(this);
  if (active.length === 0) {
    this._send('end');
  } else {
    this._passiveCount = passive.length;
    this._combinator = combinator ? Fn(combinator) : null;
    this._sources = concat(passive, active);
    this._aliveCount = 0;
    this._currents = new Array(this._sources.length);
    fillArray(this._currents, NOTHING);
    this._activating = false;
    this._emitAfterActivation = false;
    this._endAfterActivation = false;
  }
}

inherit(SampledBy, Stream, {

  _name: 'sampledBy',

  _onActivation: function() {
    var length = this._sources.length,
        i;
    this._aliveCount = length - this._passiveCount;
    this._activating = true;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny([this._handleAny, this, i]);
    }
    this._activating = false;
    if (this._emitAfterActivation) {
      this._emitAfterActivation = false;
      this._emitIfFull(true);
    }
    if (this._endAfterActivation) {
      this._send('end', null, true);
    }
  },

  _onDeactivation: function() {
    var length = this._sources.length,
        i;
    for (i = 0; i < length; i++) {
      this._sources[i].offAny([this._handleAny, this, i]);
    }
  },

  _emitIfFull: function(isCurrent) {
    if (!contains(this._currents, NOTHING)) {
      var combined = cloneArray(this._currents);
      if (this._combinator) {
        combined = this._combinator.apply(this._currents);
      }
      this._send('value', combined, isCurrent);
    }
  },

  _handleAny: function(i, event) {
    if (event.type === 'value') {
      this._currents[i] = event.value;
      if (i >= this._passiveCount) {
        if (this._activating) {
          this._emitAfterActivation = true;
        } else {
          this._emitIfFull(event.current);
        }
      }
    } else {
      if (i >= this._passiveCount) {
        this._aliveCount--;
        if (this._aliveCount === 0) {
          if (this._activating) {
            this._endAfterActivation = true;
          } else {
            this._send('end', null, event.current);
          }
        }
      }
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._sources = null;
    this._currents = null;
  }

});

Kefir.sampledBy = function(passive, active, combinator) {
  return new SampledBy(passive, active, combinator);
}

Observable.prototype.sampledBy = function(other, combinator) {
  return Kefir.sampledBy([this], [other], combinator);
}




// .combine()

Kefir.combine = function(sources, combinator) {
  var result = new SampledBy([], sources, combinator);
  result._name = 'combine';
  return result;
}

Observable.prototype.combine = function(other, combinator) {
  return Kefir.combine([this, other], combinator);
}
