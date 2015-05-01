import Stream from '../stream';
import Property from '../property';
import {extend, inherit} from './objects';
import {VALUE, ERROR, END} from '../constants';


export default function withOneSource(name, mixin) {

  mixin = extend({
    _init(args) {},
    _free() {},

    _handleValue(x, isCurrent) {
      this._send(VALUE, x, isCurrent);
    },
    _handleError(x, isCurrent) {
      this._send(ERROR, x, isCurrent);
    },
    _handleEnd(__, isCurrent) {
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
    }
  }, mixin || {});



  function buildClass(BaseClass) {
    function AnonymousObservable(source, args) {
      BaseClass.call(this);
      this._source = source;
      this._name = source._name + '.' + name;
      this._init(args);
      var $ = this;
      this._$handleAny = function(event) {
        $._handleAny(event);
      };
    }

    inherit(AnonymousObservable, BaseClass, {
      _clear() {
        BaseClass.prototype._clear.call(this);
        this._source = null;
        this._$handleAny = null;
        this._free();
      }
    }, mixin);

    return AnonymousObservable;
  }


  var StreamClass = buildClass(Stream);
  var PropertyClass = buildClass(Property);

  Stream.prototype[name] = function() {
    return new StreamClass(this, arguments);
  };

  Property.prototype[name] = function() {
    return new PropertyClass(this, arguments);
  };

}
