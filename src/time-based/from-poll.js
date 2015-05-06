const timeBased = require('../patterns/time-based');

const S = timeBased({

  _name: 'fromPoll',

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _onTick() {
    this._emitValue(this._fn());
  }

});


module.exports = function fromPoll(wait, fn) {
  return new S(wait, {fn});
}
