const {createStream} = require('../patterns/one-source');
const {VALUE, ERROR} = require('../constants');



module.exports = createStream('changes', {

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
