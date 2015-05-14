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
    const fn = this._fn;
    this._emitValue(fn());
  }

});


module.exports = function fromPoll(wait, fn) {
  return new S(wait, {fn});
}
