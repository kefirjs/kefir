const {createStream} = require('../patterns/one-source');



const S = createStream('changes', {

  _handleValue(x) {
    if (!this._activating) {
      this._emitValue(x);
    }
  },

  _handleError(x) {
    if (!this._activating) {
      this._emitError(x);
    }
  }

});


module.exports = function changes(obs) {
  return new S(obs);
};
