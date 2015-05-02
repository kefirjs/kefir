import {createProperty} from '../patterns/one-source';
import {VALUE, ERROR, NOTHING} from '../constants';


export default createProperty('scan', {

  _init({fn, seed}) {
    this._fn = fn;
    if (seed !== NOTHING) {
      this._send(VALUE, seed, true);
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
