function withTwoSources(name, mixin /*, options*/) {


  // options = extend({
  //   streamMethod: function(StreamClass, PropertyClass) {
  //     return function() {  return new StreamClass(this, arguments)  }
  //   },
  //   propertyMethod: function(StreamClass, PropertyClass) {
  //     return function() {  return new PropertyClass(this, arguments)  }
  //   }
  // }, options || {});



  mixin = extend({
    _init: function() {},
    _free: function() {},

    _handlePrimaryValue: function(x, isCurrent) {},
    _handlePrimaryEnd: function(__, isCurrent) {  this._send('end', null, isCurrent)  },

    _handleSecondaryValue: function(x, isCurrent) {  this._lastSecondary = x  },
    _handleSecondaryEnd: function(__, isCurrent) {},

    // _onActivationHook: function() {},
    // _onDeactivationHook: function() {},

    _handlePrimaryAny: function(event) {
      switch (event.type) {
        case 'value': this._handlePrimaryValue(event.value, event.current); break;
        case 'end': this._handlePrimaryEnd(event.value, event.current); break;
      }
    },
    _handleSecondaryAny: function(event) {
      switch (event.type) {
        case 'value': this._handleSecondaryValue(event.value, event.current); break;
        case 'end': this._handleSecondaryEnd(event.value, event.current); break;
      }
    },

    _onActivation: function() {
      // this._onActivationHook();
      this._secondary.onAny([this._handleSecondaryAny, this]);
      if (this._alive) {
        this._primary.onAny([this._handlePrimaryAny, this]);
      }
    },
    _onDeactivation: function() {
      // this._onDeactivationHook();
      this._secondary.offAny([this._handleSecondaryAny, this]);
      this._primary.offAny([this._handlePrimaryAny, this]);
    }
  }, mixin || {});



  function buildClass(BaseClass) {
    function AnonymousObservable(primary, secondary) {
      BaseClass.call(this);
      this._primary = primary;
      this._secondary = secondary;
      this._name = primary._name + '.' + name;
      this._lastSecondary = NOTHING;
      this._init();
    }

    inherit(AnonymousObservable, BaseClass, {
      _clear: function() {
        BaseClass.prototype._clear.call(this);
        this._primary = null;
        this._secondary = null;
        this._lastSecondary = null;
        this._free();
      }
    }, mixin);

    return AnonymousObservable;
  }


  var AnonymousStream = buildClass(Stream);
  var AnonymousProperty = buildClass(Property);

  Stream.prototype[name] = function(secondary) {
    return new AnonymousStream(this, secondary);
  }

  Property.prototype[name] = function(secondary) {
    return new AnonymousProperty(this, secondary);
  }

  // if (options.streamMethod) {
  //   Stream.prototype[name] = options.streamMethod(AnonymousStream, AnonymousProperty);
  // }

  // if (options.propertyMethod) {
  //   Property.prototype[name] = options.propertyMethod(AnonymousStream, AnonymousProperty);
  // }

}
