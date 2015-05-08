const timeBased = require('../patterns/time-based');
const {cloneArray} = require('../utils/collections');

const S = timeBased({

  _name: 'repeatedly',

  _init({xs}) {
    this._xs = cloneArray(xs);
    this._i = -1;
  },

  _onTick() {
    if (this._xs.length > 0) {
      this._i = (this._i + 1) % this._xs.length;
      this._emitValue(this._xs[this._i]);
    }
  }

});


module.exports = function repeatedly(wait, xs) {
  return new S(wait, {xs});
}
