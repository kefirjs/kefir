const {inherit} = require('../utils/objects');
const Stream = require('../stream');
const {VALUE, ERROR, END} = require('../constants');


function S(fn) {
  Stream.call(this);
  this._fn = fn;
  this._unsubscribe = null;
}

inherit(S, Stream, {

  _name: 'stream',

  _onActivation() {
    let isCurrent = true;
    let emitter = {
      emit: (x) => this._send(VALUE, x, isCurrent),
      error: (x) => this._send(ERROR, x, isCurrent),
      end: () => this._send(END, null, isCurrent),
      emitEvent: (e) => this._send(e.type, e.value, isCurrent)
    };
    this._unsubscribe = this._fn(emitter) || null;
    isCurrent = false;

    // fix https://github.com/pozadi/kefir/issues/35
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
