const {inherit} = require('../utils/objects');
const Stream = require('../stream');

function Emitter() {
  Stream.call(this);
}

inherit(Emitter, Stream, {

  _name: 'emitter',

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

module.exports = Emitter;
