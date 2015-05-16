const {createStream, createProperty} = require('../patterns/one-source');
const emitter = require('../emitter');

const mixin = {

  _init({fn}) {
    this._handler = fn;
    this._emitter = emitter(this);
  },

  _free() {
    this._handler = null;
    this._emitter = null;
  },

  _handleAny(event) {
    this._handler(this._emitter, event);
  }

};

const S = createStream('withHandler', mixin);
const P = createProperty('withHandler', mixin);



module.exports = function withHandler(obs, fn) {
  return new (obs._ofSameType(S, P))(obs, {fn});
};
