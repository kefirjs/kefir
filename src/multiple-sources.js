const {VALUE, ERROR, END} = require('./constants');
const {inherit} = require('./utils/objects');
const AbstractPool = require('./many-sources/abstract-pool');





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
    this._emitValue(x);
    return this;
  },
  error(x) {
    this._emitError(x);
    return this;
  },
  end() {
    this._emitEnd();
    return this;
  },
  emitEvent(event) {
    this._emit(event.type, event.value);
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
      this._source.onAny(this._$handleMainSource);
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
      this._emitError(event.value);
    }
    if (event.type === END) {
      if (this._isEmpty()) {
        this._emitEnd();
      } else {
        this._mainEnded = true;
      }
    }
  },

  _onEmpty() {
    if (this._mainEnded) {
      this._emitEnd();
    }
  },

  _clear() {
    AbstractPool.prototype._clear.call(this);
    this._source = null;
    this._lastCurrent = null;
    this._$handleMainSource = null;
  }

});













module.exports = {Pool, Bus, FlatMap};
