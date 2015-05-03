const {createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');


const P = createProperty('toProperty', {

  _init({fn}) {
    this._getInitialCurrent = fn;
  },

  _onActivation() {
    if (this._getInitialCurrent !== null) {
      this._send(VALUE, this._getInitialCurrent(), true);
    }
    this._source.onAny(this._$handleAny);  // copied from patterns/one-source
  }

});



module.exports = function toProperty(obs, fn /* Function | null */) {
  return new P(obs, {fn});
};
