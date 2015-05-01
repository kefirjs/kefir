import {Stream, Property} from '../../core';
import {inherit} from '../objects';
import {VALUE, ERROR, END} from '../other';


function createConstructor(BaseClass, name) {
  return function AnonymousObservable(source, args) {
    BaseClass.call(this);
    this._source = source;
    this._name = source._name + '.' + name;
    this._init(args);
    this._$handleAny = ((event) => this._handleAny(event));
  }
}

function createClassMethods(BaseClass) {
  return {

    _init: function(args) {},
    _free: function() {},

    _handleValue: function(x, isCurrent) {
      this._send(VALUE, x, isCurrent);
    },
    _handleError: function(x, isCurrent) {
      this._send(ERROR, x, isCurrent);
    },
    _handleEnd: function(__, isCurrent) {
      this._send(END, null, isCurrent);
    },

    _handleAny: function(event) {
      switch (event.type) {
        case VALUE: this._handleValue(event.value, event.current); break;
        case ERROR: this._handleError(event.value, event.current); break;
        case END: this._handleEnd(event.value, event.current); break;
      }
    },

    _onActivation: function() {
      this._source.onAny(this._$handleAny);
    },
    _onDeactivation: function() {
      this._source.offAny(this._$handleAny);
    },

    _clear: function() {
      BaseClass.prototype._clear.call(this);
      this._source = null;
      this._$handleAny = null;
      this._free();
    }

  };
}



export function createStream(name, mixin) {
  const AnonymousStream = createConstructor(Stream, name);
  inherit(AnonymousStream, Stream, createClassMethods(Stream), mixin);
  return AnonymousStream;
}


export function createProperty(name, mixin) {
  const AnonymousProperty = createConstructor(Property, name);
  inherit(AnonymousProperty, Property, createClassMethods(Property), mixin);
  return AnonymousProperty;
}
