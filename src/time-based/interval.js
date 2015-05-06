const timeBased = require('../patterns/time-based');

const S = timeBased({

  _name: 'interval',

  _init({x}) {
    this._x = x;
  },

  _free() {
    this._x = null;
  },

  _onTick() {
    this._emitValue(this._x);
  }

});


module.exports = function interval(wait, x) {
  return new S(wait, {x});
}
