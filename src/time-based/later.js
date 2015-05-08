const timeBased = require('../patterns/time-based');

const S = timeBased({

  _name: 'later',

  _init({x}) {
    this._x = x;
  },

  _free() {
    this._x = null;
  },

  _onTick() {
    this._emitValue(this._x);
    this._emitEnd();
  }

});


module.exports = function later(wait, x) {
  return new S(wait, {x});
}
