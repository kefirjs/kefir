const timeBased = require('../patterns/time-based');
const emitter = require('../emitter');


const S = timeBased({

  _name: 'withInterval',

  _init({fn}) {
    this._fn = fn;
    this._emitter = emitter(this);
  },

  _free() {
    this._fn = null;
    this._emitter = null;
  },

  _onTick() {
    this._fn(this._emitter);
  }

});


module.exports = function withInterval(wait, fn) {
  return new S(wait, {fn});
}
