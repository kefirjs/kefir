const {inherit} = require('../utils/objects');
const Stream = require('../stream');
const {VALUE, ERROR, END} = require('../constants');

function Emitter() {
  Stream.call(this);
}

inherit(Emitter, Stream, {

  _name: 'emitter',

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

function emitter() {
  return new Emitter();
};

module.exports = {emitter, Emitter};
