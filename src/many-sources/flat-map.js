const {VALUE, ERROR, END} = require('../constants');
const {inherit} = require('../utils/objects');
const AbstractPool = require('./abstract-pool');




function FlatMap(source, fn, options) {
  AbstractPool.call(this, options);
  this._source = source;
  this._fn = fn;
  this._mainEnded = false;
  this._lastCurrent = null;
  this._$handleMain = (event) => this._handleMain(event);
}

inherit(FlatMap, AbstractPool, {

  _name: 'flatMap',

  _onActivation() {
    AbstractPool.prototype._onActivation.call(this);
    if (this._active) {
      this._source.onAny(this._$handleMain);
    }
  },

  _onDeactivation() {
    AbstractPool.prototype._onDeactivation.call(this);
    this._source.offAny(this._$handleMain);
  },

  _handleMain(event) {

    if (event.type === VALUE) {
      // FIXME: should be ._lastCurrentBeforeDeactivation
      if (!this._activating || this._lastCurrent !== event.value) {
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
    this._$handleMain = null;
  }

});




module.exports = FlatMap;
