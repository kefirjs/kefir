const Stream = require('../stream');
const Property = require('../property');
const {inherit} = require('../utils/objects');
const {VALUE, ERROR, END} = require('../constants');


function createConstructor(BaseClass, name) {
  return function AnonymousObservable(source, options) {
    BaseClass.call(this);
    this._source = source;
    this._name = `${source._name}.${name}`;
    this._init(options);
    this._$handleAny = ((event) => this._handleAny(event));
  }
}

function createClassMethods(BaseClass) {
  return {

    _init(options) {},
    _free() {},

    _handleValue(x) {
      this._send(VALUE, x);
    },
    _handleError(x) {
      this._send(ERROR, x);
    },
    _handleEnd() {
      this._send(END);
    },

    _handleAny(event) {
      switch (event.type) {
        case VALUE: this._handleValue(event.value); break;
        case ERROR: this._handleError(event.value); break;
        case END: this._handleEnd(); break;
      }
    },

    _onActivation() {
      this._source.onAny(this._$handleAny);
    },
    _onDeactivation() {
      this._source.offAny(this._$handleAny);
    },

    _clear() {
      BaseClass.prototype._clear.call(this);
      this._source = null;
      this._$handleAny = null;
      this._free();
    }

  };
}



function createStream(name, mixin) {
  const S = createConstructor(Stream, name);
  inherit(S, Stream, createClassMethods(Stream), mixin);
  return S;
}


function createProperty(name, mixin) {
  const P = createConstructor(Property, name);
  inherit(P, Property, createClassMethods(Property), mixin);
  return P;
}


module.exports = {createStream, createProperty};
