const {createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');
const {isFn} = require('../utils/types');


module.exports = createProperty('toProperty', {

  _init({fn}) {
    if (fn !== undefined) {
      if (isFn(fn)) {
        this._getInitialCurrent = fn;
      } else {
        throw new TypeError('The .toProperty method must be called with no args or with a function as an argument');
      }
    } else {
      this._getInitialCurrent = null;
    }
  },

  _onActivation() {
    if (this._getInitialCurrent !== null) {
      this._send(VALUE, this._getInitialCurrent(), true);
    }
    this._source.onAny(this._$handleAny);
  }

});

