function getValueAll(properties) {
  var result = new Array(properties.length);
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].has('value')) {
      result[i] = properties[i].get('value');
    } else {
      return null;
    }
  }
  return result;
}



function withMultSource(name, mixin, noMethod) {

  function AnonymousProperty(args) {
    Property.call(this);
    this._multSubscriber = new MultSubscriber([this._handleAny, this])
    this._init(args);
  }

  inherit(AnonymousProperty, Property, {

    _name: name,

    _init: function(args) {},
    _free: function() {},
    _onActivationHook: function() {},
    _onPreActivationHook: function() {},
    _onDeactivationHook: function() {},

    _handleValue: function(x, isCurrent) {  this._send('value', x)  },
    _handleError: function(x, isCurrent) {  this._send('error', x)  },
    _handleEnd: function(x, isCurrent) {},

    _handleAny: function(type, x, isCurrent) {
      switch (type) {
        case 'value': this._handleValue(x, isCurrent); break;
        case 'error': this._handleError(x, isCurrent); break;
        case 'end': this._handleEnd(x, isCurrent); break;
      }
    },

    _onActivation: function() {
      this._onPreActivationHook();
      this._multSubscriber.start();
      this._onActivationHook();
    },
    _onDeactivation: function() {
      this._multSubscriber.stop();
      this._onDeactivationHook();
    },

    _clear: function() {
      Property.prototype._clear.call(this);
      this._multSubscriber.clear();
      this._multSubscriber = null;
      this._free();
    }

  }, mixin);

  if (!noMethod) {
    Kefir[name] = function() {
      return new AnonymousProperty(arguments);
    }
  }

  return AnonymousProperty;
}





function MultSubscriber(listener) {
  this.listener = new Fn(listener);
  this.properties = [];
  this.active = false;
}

extend(MultSubscriber.prototype, {

  start: function() {
    if (!this.active) {
      this.active = true;
      if (this.hasProperties()) {
        var properties = cloneArray(this.properties);
        for (var i = 0; i < properties.length; i++) {
          this.subToProp(properties[i]);
        }
      }
    }
  },
  stop: function() {
    if (this.active) {
      this.active = false;
      for (var i = 0; i < this.properties.length; i++) {
        this.unsubFromProp(this.properties[i]);
      }
    }
  },

  subToProp: function(property) {
    if (this.active) {
      property.watch('any', [this.handleAny, this, property]);
    }
  },
  unsubFromProp: function(property) {
    property.off('any', [this.handleAny, this, property]);
  },

  handleAny: function(property, type, x, isCurrent) {
    Fn.call(this.listener, [type, x, isCurrent]);
    if (type === 'end') {
      this.remove(property);
    }
  },

  addAll: function(properties) {
    for (var i = 0; i < properties.length; i++) {
      this.add(properties[i])
    }
  },
  add: function(property) {
    this.properties.push(property);
    this.subToProp(property);
  },
  remove: function(property) {
    for (var i = 0; i < this.properties.length; i++) {
      if (this.properties[i] === property) {
        this.properties.splice(i, 1);
        this.unsubFromProp(property);
        break;
      }
    }
    if (this.properties.length === 0 && this.onLastRemovedCb) {
      Fn.call(this.onLastRemovedCb);
    }
  },
  removeAll: function(){
    if (this.hasProperties()) {
      for (var i = 0; i < this.properties.length; i++) {
        this.unsubFromProp(this.properties[i]);
      }
      this.properties = [];
      if (this.onLastRemovedCb) {
        Fn.call(this.onLastRemovedCb);
      }
    }
  },

  onLastRemoved: function(fn) {
    this.onLastRemovedCb = new Fn(fn);
    if (!this.hasProperties()) {
      Fn.call(this.onLastRemovedCb);
    }
  },
  offLastRemoved: function() {
    this.onLastRemovedCb = null;
  },
  hasProperties: function() {
    return this.properties.length > 0;
  },

  clear: function() {
    this.active = false;
    this.offLastRemoved();
    this.removeAll();
  }

});
