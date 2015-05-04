const timeBased = require('../patterns/time-based');
const {VALUE, END} = require('../constants');

const S = timeBased({

  _name: 'later',

  _init({x}) {
    this._x = x;
  },

  _free() {
    this._x = null;
  },

  _onTick() {
    this._send(VALUE, this._x);
    this._send(END);
  }

});


module.exports = function later(wait, x) {
  return new S(wait, {x});
}
