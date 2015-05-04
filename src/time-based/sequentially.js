const timeBased = require('../patterns/time-based');
const {VALUE, END} = require('../constants');
const {cloneArray} = require('../utils/collections');

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
      this._send(VALUE, this._xs[0]);
      this._send(END);
    } else {
      this._send(VALUE, this._xs.shift());
    }
  }

});


module.exports = function sequentially(wait, xs) {
  return new S(wait, {xs});
}
