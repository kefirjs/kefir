const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, ERROR, END} = require('../constants');

const mixin = {

  _init({fn}) {
    this._handler = fn;
    this._isCurrent = false;
    this._emitter = {
      emit: (x) => this._send(VALUE, x, this._isCurrent),
      error: (x) => this._send(ERROR, x, this._isCurrent),
      end: () => this._send(END, null, this._isCurrent),
      emitEvent: (e) => this._send(e.type, e.value, this._isCurrent)
    };
  },

  _free() {
    this._handler = null;
    this._emitter = null;
  },

  _handleAny(event) {
    this._isCurrent = event.current;
    this._handler(this._emitter, event);
    this._isCurrent = false;
  }

};

exports.WithHandlerStream = createStream('withHandler', mixin);
exports.WithHandlerProperty = createProperty('withHandler', mixin);


