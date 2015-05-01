import {createStream} from '../patterns/one-source';
import {VALUE, ERROR} from '../constants';



export default createStream('changes', {

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
