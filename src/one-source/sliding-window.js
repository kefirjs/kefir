const {createStream, createProperty} = require('../patterns/one-source');
const {slide} = require('../utils/collections');

const mixin = {

  _init({min, max}) {
    this._max = max;
    this._min = min;
    this._buff = [];
  },

  _free() {
    this._buff = null;
  },

  _handleValue(x) {
    this._buff = slide(this._buff, x, this._max);
    if (this._buff.length >= this._min) {
      this._emitValue(this._buff);
    }
  }

};

const S = createStream('slidingWindow', mixin);
const P = createProperty('slidingWindow', mixin);


module.exports = function slidingWindow(obs, max, min = 0) {
  return new (obs.ofSameType(S, P))(obs, {min, max});
};
