import {createStream, createProperty} from '../patterns/one-source';

const mixin = {
  _handleError(x) {
    this._emitError(x);
    this._emitEnd();
  },
};

const S = createStream('endOnError', mixin);
const P = createProperty('endOnError', mixin);

export default function endOnError(obs) {
  // prettier-ignore
  return new (obs._ofSameType(S, P))(obs);
}
