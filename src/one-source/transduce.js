const {createStream, createProperty} = require('../patterns/one-source');

function xformForObs(obs) {
  return {

    '@@transducer/step'(res, input) {
      obs._emitValue(input);
      return null;
    },

    '@@transducer/result'(res) {
      obs._emitEnd();
      return null;
    }

  };
}

const mixin = {

  _init({transducer}) {
    this._xform = transducer(xformForObs(this));
  },

  _free() {
    this._xform = null;
  },

  _handleValue(x) {
    if (this._xform['@@transducer/step'](null, x) !== null) {
      this._xform['@@transducer/result'](null);
    }
  },

  _handleEnd() {
    this._xform['@@transducer/result'](null);
  }

};

const S = createStream('transduce', mixin);
const P = createProperty('transduce', mixin);


module.exports = function transduce(obs, transducer) {
  return new (obs.ofSameType(S, P))(obs, {transducer});
};
