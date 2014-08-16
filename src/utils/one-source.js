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

    _handleAny: function(type, x, isCurrent) {
      switch (type) {
        case 'value': this._handleValue(x, isCurrent); break;
        case 'end': this._handleEnd(x, isCurrent); break;
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



  function AnonymousStream(source, args) {
    Stream.call(this);
    this._source = source;
    this._name = source._name + '.' + name;
    this._init(args);
  }

  inherit(AnonymousStream, Stream, {
    _clear: function() {
      Stream.prototype._clear.call(this);
      this._source = null;
      this._free();
    }
  }, mixin);



  function AnonymousProperty(source, args) {
    Property.call(this);
    this._source = source;
    this._name = source._name + '.' + name;
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {
    _clear: function() {
      Property.prototype._clear.call(this);
      this._source = null;
      this._free();
    }
  }, mixin);



  if (options.streamMethod) {
    Stream.prototype[name] = options.streamMethod(AnonymousStream, AnonymousProperty);
  }

  if (options.propertyMethod) {
    Property.prototype[name] = options.propertyMethod(AnonymousStream, AnonymousProperty);
  }

}
