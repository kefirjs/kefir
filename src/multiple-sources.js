// .merge()

function Merge(sources) {
  Stream.call(this);
  if (sources.length === 0) {
    this._send('end');
  } else {
    this._sources = sources;
    this._aliveCount = 0;
  }
}

inherit(Merge, Stream, {

  _name: 'merge',

  _onActivation: function() {
    var length = this._sources.length,
        i;
    this._aliveCount = length;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny([this._handleAny, this]);
    }
  },

  _onDeactivation: function() {
    var length = this._sources.length,
        i;
    for (i = 0; i < length; i++) {
      this._sources[i].offAny([this._handleAny, this]);
    }
  },

  _handleAny: function(event) {
    if (event.type === 'value') {
      this._send('value', event.value, event.current);
    } else {
      this._aliveCount--;
      if (this._aliveCount === 0) {
        this._send('end', null, event.current);
      }
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._sources = null;
  }

});

Kefir.merge = function() {
  return new Merge(agrsToArray(arguments));
}

Observable.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
}






// .sampledBy()

function SampledBy(passive, active, combinator) {
  Stream.call(this);
  if (active.length === 0) {
    this._send('end');
  } else {
    this._passiveCount = passive.length;
    this._combinator = combinator ? new Fn(combinator) : null;
    this._sources = concat(passive, active);
    this._aliveCount = 0;
    this._currents = new Array(this._sources.length);
    fillArray(this._currents, NOTHING);
  }
}

inherit(SampledBy, Stream, {

  _name: 'sampledBy',

  _onActivation: function() {
    var length = this._sources.length,
        i;
    this._aliveCount = length - this._passiveCount;
    for (i = 0; i < length; i++) {
      this._sources[i].onAny([this._handleAny, this, i]);
    }
  },

  _onDeactivation: function() {
    var length = this._sources.length,
        i;
    for (i = 0; i < length; i++) {
      this._sources[i].offAny([this._handleAny, this, i]);
    }
  },

  _handleAny: function(i, event) {
    if (event.type === 'value') {
      this._currents[i] = event.value;
      if (i >= this._passiveCount) {
        if (!contains(this._currents, NOTHING)) {
          var combined = cloneArray(this._currents);
          if (this._combinator) {
            combined = Fn.call(this._combinator, this._currents);
          }
          this._send('value', combined, event.current);
        }
      }
    } else {
      if (i >= this._passiveCount) {
        this._aliveCount--;
        if (this._aliveCount === 0) {
          this._send('end', null, event.current);
        }
      }
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._sources = null;
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






// .pool()

function _AbstractPool() {
  Stream.call(this);
  this._sources = [];
}

inherit(_AbstractPool, Stream, {

  _name: 'abstractPool',

  _sub: function(obs) {
    obs.onAny([this._handleSubAny, this]);
    obs.onEnd([this._remove, this, obs]);
  },
  _unsub: function(obs) {
    obs.offAny([this._handleSubAny, this]);
    obs.offEnd([this._remove, this, obs]);
  },

  _handleSubAny: function(event) {
    if (event.type === 'value') {
      this._send('value', event.value, event.current);
    }
  },

  _add: function(obs) {
    this._sources.push(obs);
    if (this._active) {
      this._sub(obs);
    }
  },
  _remove: function(obs) {
    if (this._active) {
      this._unsub(obs);
    }
    for (var i = 0; i < this._sources.length; i++) {
      if (this._sources[i] === obs) {
        this._sources.splice(i, 1);
        return;
      }
    }
  },

  _onActivation: function() {
    var sources = cloneArray(this._sources);
    for (var i = 0; i < sources.length; i++) {
      this._sub(sources[i]);
    }
  },
  _onDeactivation: function() {
    for (var i = 0; i < this._sources.length; i++) {
      this._unsub(this._sources[i]);
    }
  }

});



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

function FlatMap(source, fn) {
  _AbstractPool.call(this);
  this._source = source;
  this._name = source._name + '.flatMap';
  this._fn = fn ? new Fn(fn) : null;
  this._mainEnded = false;
}

inherit(FlatMap, _AbstractPool, {

  _onActivation: function() {
    _AbstractPool.prototype._onActivation.call(this);
    this._source.onAny([this._handleMainSource, this]);
  },
  _onDeactivation: function() {
    _AbstractPool.prototype._onDeactivation.call(this);
    this._source.offAny([this._handleMainSource, this]);
  },

  _handleMainSource: function(event) {
    if (event.type === 'value') {
      this._add(this._fn ? Fn.call(this._fn, [event.value]) : event.value);
    } else {
      if (this._sources.length === 0) {
        this._send('end', null, event.current);
      } else {
        this._mainEnded = true;
      }
    }
  },

  _remove: function(obs) {
    _AbstractPool.prototype._remove.call(this, obs);
    if (this._mainEnded && this._sources.length === 0) {
      this._send('end');
    }
  },

  _clear: function() {
    _AbstractPool.prototype._clear.call(this);
    this._source = null;
  }

});

Observable.prototype.flatMap = function(fn) {
  return new FlatMap(this, fn);
}







// .flatMapLatest()
// TODO

