function withOneSource(name, mixin) {

  function AnonymousProperty(source, args) {
    Property.call(this);
    this._source = source;
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {

    _name: name,

    _init: function(args) {},
    _free: function() {},

    _handleValue: function(x, isCurrent) {  this._send('value', x)  },
    _handleError: function(x, isCurrent) {  this._send('error', x)  },
    _handleEnd: function(x, isCurrent) {  this._send('end', x)  },
    _onActivationHook: function() {},
    _onDeactivationHook: function() {},

    _handleAny: function(type, x, isCurrent) {
      switch (type) {
        case 'value': this._handleValue(x, isCurrent); break;
        case 'error': this._handleError(x, isCurrent); break;
        case 'end': this._handleEnd(x, isCurrent); break;
      }
    },

    _onActivation: function() {
      this._source.watch('any', [this._handleAny, this]);
      this._onActivationHook();
    },
    _onDeactivation: function() {
      this._source.off('any', [this._handleAny, this]);
      this._onDeactivationHook();
    },

    _clear: function() {
      Property.prototype._clear.call(this);
      this._source = null;
      this._free();
    }

  }, mixin);

  Property.prototype[name] = function() {
    return new AnonymousProperty(this, arguments);
  }
}
