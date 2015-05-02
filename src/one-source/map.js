import {createStream, createProperty} from '../patterns/one-source';
import {VALUE} from '../constants';

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleValue(x, isCurrent) {
    this._send(VALUE, this._fn(x), isCurrent);
  }

};

const MapS = createStream('map', mixin);
const MapP = createProperty('map', mixin);

export default function map(obs, fn) {
  return new (obs.ofSameType(MapS, MapP))(obs, {fn});
}
