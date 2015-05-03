const {createStream} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');



const S = createStream('changes', {

  _handleValue(x, isCurrent) {
    if (!isCurrent) {
      this._send(VALUE, x);
    }
  },

  _handleError(x, isCurrent) {
    if (!isCurrent) {
      this._send(ERROR, x);
    }
  }

});


module.exports = function changes(obs) {
  return new S(obs);
};
