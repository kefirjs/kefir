const timeBased = require('../patterns/time-based');
const {cloneArray} = require('../utils/collections');
const never = require('../primary/never');

const S = timeBased({

  _name: 'sequentially',

  _init({xs}) {
    this._xs = cloneArray(xs);
  },

  _free() {
    this._xs = null;
  },

  _onTick() {
    if (this._xs.length === 1) {
      this._emitValue(this._xs[0]);
      this._emitEnd();
    } else {
      this._emitValue(this._xs.shift());
    }
  }

});


module.exports = function sequentially(wait, xs) {
  return xs.length === 0 ? never() : new S(wait, {xs});
}
