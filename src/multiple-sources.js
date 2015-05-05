const Stream = require('./stream');
const {VALUE, ERROR, END} = require('./constants');
const {inherit, extend} = require('./utils/objects');
const {cloneArray, map} = require('./utils/collections');
const {spread} = require('./utils/functions');
const {isArray} = require('./utils/types');
const never = require('./primary/never');
const AbstractPool = require('./many-sources/abstract-pool');





// .concat()
// TODO: implement with repeat() maybe?

let MergeLike = {
  _onEmpty() {
    if (this._initialised) {
      this._send(END, null, this._activating);
    }
  }
};

function Concat(sources) {
  AbstractPool.call(this, {concurLim: 1, queueLim: -1});
  if (sources.length === 0) {
    this._send(END);
  } else {
    this._addAll(sources);
  }
  this._initialised = true;
}

inherit(Concat, AbstractPool, extend({_name: 'concat'}, MergeLike));







// .pool()

function Pool() {
  AbstractPool.call(this);
}

inherit(Pool, AbstractPool, {

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
  AbstractPool.call(this);
}

inherit(Bus, AbstractPool, {

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

function FlatMap(source, fn = (x => x), options) {
  AbstractPool.call(this, options);
  this._source = source;
  this._fn = fn;
  this._mainEnded = false;
  this._lastCurrent = null;

  let $ = this;
  this._$handleMainSource = function(event) {
    $._handleMainSource(event);
  };
}

inherit(FlatMap, AbstractPool, {

  _onActivation() {
    AbstractPool.prototype._onActivation.call(this);
    if (this._active) {
      this._activating = true;
      this._source.onAny(this._$handleMainSource);
      this._activating = false;
    }
  },
  _onDeactivation() {
    AbstractPool.prototype._onDeactivation.call(this);
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
    AbstractPool.prototype._clear.call(this);
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
      return isArray(source) ? never() : source;
    });
    this._combinator = combinator ? spread(combinator, this._sources.length) : (x => x);
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




module.exports = {Concat, Pool, Bus, FlatMap, Zip};
