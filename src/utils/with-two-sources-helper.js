import Stream from '../stream';
import Property from '../property';
import {extend, inherit} from './objects';
import {VALUE, ERROR, END, NOTHING} from '../constants';
import {rest} from './collections';


export default function withTwoSources(name, mixin /*, options*/) {

  mixin = extend({
    _init(args) {},
    _free() {},

    _handlePrimaryValue(x, isCurrent) {
      this._send(VALUE, x, isCurrent);
    },
    _handlePrimaryError(x, isCurrent) {
      this._send(ERROR, x, isCurrent);
    },
    _handlePrimaryEnd(_, isCurrent) {
      this._send(END, null, isCurrent);
    },

    _handleSecondaryValue(x, isCurrent) {
      this._lastSecondary = x;
    },
    _handleSecondaryError(x, isCurrent) {
      this._send(ERROR, x, isCurrent);
    },
    _handleSecondaryEnd(_, isCurrent) {},

    _handlePrimaryAny(event) {
      switch (event.type) {
        case VALUE:
          this._handlePrimaryValue(event.value, event.current);
          break;
        case ERROR:
          this._handlePrimaryError(event.value, event.current);
          break;
        case END:
          this._handlePrimaryEnd(event.value, event.current);
          break;
      }
    },
    _handleSecondaryAny(event) {
      switch (event.type) {
        case VALUE:
          this._handleSecondaryValue(event.value, event.current);
          break;
        case ERROR:
          this._handleSecondaryError(event.value, event.current);
          break;
        case END:
          this._handleSecondaryEnd(event.value, event.current);
          this._removeSecondary();
          break;
      }
    },

    _removeSecondary() {
      if (this._secondary !== null) {
        this._secondary.offAny(this._$handleSecondaryAny);
        this._$handleSecondaryAny = null;
        this._secondary = null;
      }
    },

    _onActivation() {
      if (this._secondary !== null) {
        this._secondary.onAny(this._$handleSecondaryAny);
      }
      if (this._alive) {
        this._primary.onAny(this._$handlePrimaryAny);
      }
    },
    _onDeactivation() {
      if (this._secondary !== null) {
        this._secondary.offAny(this._$handleSecondaryAny);
      }
      this._primary.offAny(this._$handlePrimaryAny);
    }
  }, mixin || {});



  function buildClass(BaseClass) {
    function AnonymousObservable(primary, secondary, args) {
      BaseClass.call(this);
      this._primary = primary;
      this._secondary = secondary;
      this._name = primary._name + '.' + name;
      this._lastSecondary = NOTHING;
      var $ = this;
      this._$handleSecondaryAny = function(event) {
        $._handleSecondaryAny(event);
      };
      this._$handlePrimaryAny = function(event) {
        $._handlePrimaryAny(event);
      };
      this._init(args);
    }

    inherit(AnonymousObservable, BaseClass, {
      _clear() {
        BaseClass.prototype._clear.call(this);
        this._primary = null;
        this._secondary = null;
        this._lastSecondary = null;
        this._$handleSecondaryAny = null;
        this._$handlePrimaryAny = null;
        this._free();
      }
    }, mixin);

    return AnonymousObservable;
  }


  var AnonymousStream = buildClass(Stream);
  var AnonymousProperty = buildClass(Property);

  Stream.prototype[name] = function(secondary) {
    return new AnonymousStream(this, secondary, rest(arguments, 1, []));
  };

  Property.prototype[name] = function(secondary) {
    return new AnonymousProperty(this, secondary, rest(arguments, 1, []));
  };

}
