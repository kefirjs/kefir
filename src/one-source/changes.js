const {createStream} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');



const S = createStream('changes', {

  _handleValue(x) {
    if (!this._activating) {
      this._send(VALUE, x);
    }
  },

  _handleError(x) {
    if (!this._activating) {
      this._send(ERROR, x);
    }
  }

});


module.exports = function changes(obs) {
  return new S(obs);
};
