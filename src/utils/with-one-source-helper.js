function withOneSource(name, mixin, options) {


  options = extend({
    streamMethod: function(StreamClass, PropertyClass) {
      return function() {  return new StreamClass(this, arguments)  }
    },
    propertyMethod: function(StreamClass, PropertyClass) {
      return function() {  return new PropertyClass(this, arguments)  }
    }
  }, options || {});



  mixin = extend({
    _init: function(args) {},
    _free: function() {},

    _handleValue: function(x, isCurrent) {  this._send('value', x, isCurrent)  },
    _handleEnd: function(__, isCurrent) {  this._send('end', null, isCurrent)  },

    _onActivationHook: function() {},
    _onDeactivationHook: function() {},

    _handleAny: function(event) {
      switch (event.type) {
        case 'value': this._handleValue(event.value, event.current); break;
        case 'end': this._handleEnd(event.value, event.current); break;
      }
    },

    _onActivation: function() {
      this._onActivationHook();
      this._source.onAny([this._handleAny, this]);
    },
    _onDeactivation: function() {
      this._onDeactivationHook();
      this._source.offAny([this._handleAny, this]);
    }
  }, mixin || {});



  function buildClass(BaseClass) {
    function AnonymousObservable(source, args) {
      BaseClass.call(this);
      this._source = source;
      this._name = source._name + '.' + name;
      this._init(args);
    }

    inherit(AnonymousObservable, BaseClass, {
      _clear: function() {
        BaseClass.prototype._clear.call(this);
        this._source = null;
        this._free();
      }
    }, mixin);

    return AnonymousObservable;
  }


  var AnonymousStream = buildClass(Stream);
  var AnonymousProperty = buildClass(Property);

  if (options.streamMethod) {
    Stream.prototype[name] = options.streamMethod(AnonymousStream, AnonymousProperty);
  }

  if (options.propertyMethod) {
    Property.prototype[name] = options.propertyMethod(AnonymousStream, AnonymousProperty);
  }

}
