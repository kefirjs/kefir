const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, END} = require('../constants');

function xformForObs(obs) {
  return {

    '@@transducer/step'(res, input) {
      obs._send(VALUE, input);
      return null;
    },

    '@@transducer/result'(res) {
      obs._send(END);
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
