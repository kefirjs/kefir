const {inherit} = require('../utils/objects');
const Stream = require('../stream');
const emitter = require('../emitter');

function S(fn) {
  Stream.call(this);
  this._fn = fn;
  this._unsubscribe = null;
}

inherit(S, Stream, {

  _name: 'stream',

  _onActivation() {
    const fn = this._fn;
    const unsubscribe = fn(emitter(this));
    this._unsubscribe = (typeof unsubscribe === 'function') ? unsubscribe : null;

    // fix https://github.com/rpominov/kefir/issues/35
    if (!this._active) {
      this._callUnsubscribe();
    }
  },

  _callUnsubscribe() {
    if (this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  },

  _onDeactivation() {
    this._callUnsubscribe();
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._fn = null;
  }

});

module.exports = function stream(fn) {
  return new S(fn);
};
