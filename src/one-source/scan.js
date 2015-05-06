const {createProperty} = require('../patterns/one-source');
const {VALUE, ERROR, NOTHING} = require('../constants');


const P = createProperty('scan', {

  _init({fn, seed}) {
    this._fn = fn;
    if (seed !== NOTHING) {
      this._send(VALUE, seed);
    }
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x) {
    if (this._currentEvent !== null && this._currentEvent.type !== ERROR) {
      x = this._fn(this._currentEvent.value, x);
    }
    this._send(VALUE, x);
  }

});


module.exports = function scan(obs, fn, seed) {
  return new P(obs, {fn, seed});
};
