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

    _handleValue(x, isCurrent) {
      this._send(VALUE, x, isCurrent);
    },
    _handleError(x, isCurrent) {
      this._send(ERROR, x, isCurrent);
    },
    _handleEnd(_, isCurrent) {
      this._send(END, null, isCurrent);
    },

    _handleAny(event) {
      switch (event.type) {
        case VALUE: this._handleValue(event.value, event.current); break;
        case ERROR: this._handleError(event.value, event.current); break;
        case END: this._handleEnd(event.value, event.current); break;
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
  const AnonymousStream = createConstructor(Stream, name);
  inherit(AnonymousStream, Stream, createClassMethods(Stream), mixin);
  return AnonymousStream;
}


function createProperty(name, mixin) {
  const AnonymousProperty = createConstructor(Property, name);
  inherit(AnonymousProperty, Property, createClassMethods(Property), mixin);
  return AnonymousProperty;
}


module.exports = {createStream, createProperty};
