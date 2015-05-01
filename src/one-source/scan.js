import {createProperty} from '../patterns/one-source';
import {VALUE, ERROR} from '../constants';


export default createProperty('scan', {

  _init(args) {
    this._fn = args[0];
    if (args.length > 1) {
      this._send(VALUE, args[1], true);
    }
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    if (this._currentEvent !== null && this._currentEvent.type !== ERROR) {
      x = this._fn(this._currentEvent.value, x);
    }
    this._send(VALUE, x, isCurrent);
  }

});
