// .merge()

withMultSource('merge', {
  __init: function(args) {
    var sources = agrsToArray(args);
    if (sources.length > 0) {
      this.__multSubscriber.addAll(sources);
      this.__multSubscriber.onLastRemoved([this.__send, this, 'end']);
    } else {
      this.__send('end');
    }
  }
});






// .combine()

withMultSource('combine', {
  __init: function(args) {
    this.__sources = args[0];
    this.__fn = args[1] ? new Callable(args[1]) : null;
    if (this.__sources.length > 0) {
      this.__multSubscriber.addAll(this.__sources);
      this.__multSubscriber.onLastRemoved([this.__send, this, 'end']);
    } else {
      this.__send('end');
    }
  },
  __free: function() {
    this.__sources = null;
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (hasValueAll(this.__sources)) {
      if (this.__fn) {
        this.__send('value', Callable.call(this.__fn, getValueAll(this.__sources)));
      } else {
        this.__send('value', getValueAll(this.__sources));
      }
    }
  }
});









// .flatMap()

var FlatMapProperty = withMultSource('flatMap', {
  __init: function(args) {
    this.__source = args[0];
    this.__fn = args[1] ? new Callable(args[1]) : null;
    this.__multSubscriber.onLastRemoved([this.__endIfSourceEnded, this]);
    this.__source.on('end', [this.__endIfNoSubSources, this]);
    if (this.__source.has('value')) {
      this.__onValue(this.__source.get('value'));
    }
    if (this.__source.has('error')) {
      this.__onError(this.__source.get('error'));
    }
  },
  __free: function() {
    this.__source = null;
    this.__fn = null;
  },
  __onActivationHook: function() {
    this.__source.on('both', [this.__onBoth, this])
  },
  __onDeactivationHook: function() {
    this.__source.off('both', [this.__onBoth, this])
  },
  __onValue: function(x) {
    if (this.__fn) {
      this.__multSubscriber.add(Callable.call(this.__fn, [x]));
    } else {
      this.__multSubscriber.add(x);
    }
  },
  __onError: function(e) {
    this.__send('error', e);
  },
  __onBoth: function(type, x) {
    if (type === 'value') {
      this.__onValue(x);
    } else {
      this.__onError(x);
    }
  },
  __endIfSourceEnded: function() {
    if (this.__source.isEnded()) {
      this.__send('end');
    }
  },
  __endIfNoSubSources: function() {
    if (!this.__multSubscriber.hasProperties()) {
      this.__send('end');
    }
  }

}, false);

Property.prototype.flatMap = function(fn) {
  return new FlatMapProperty([this, fn]);
};






// .flatMapLatest()

function FlatMapLatestProperty() {
  FlatMapProperty.apply(this, arguments);
}

inherit(FlatMapLatestProperty, FlatMapProperty, {
  __name: 'FlatMapLatestProperty',
  __onValue: function(x) {
    this.__multSubscriber.removeAll();
    FlatMapProperty.prototype.__onValue.call(this, x);
  }
});

Property.prototype.flatMapLatest = function(fn) {
  return new FlatMapLatestProperty([this, fn]);
};






// .pool()

withMultSource('pool', {
  add: function(property) {
    this.__multSubscriber.add(property);
  },
  remove: function(property) {
    this.__multSubscriber.remove(property);
  }
});











// utils



function hasValueAll(properties) {
  for (var i = 0; i < properties.length; i++) {
    if (!properties[i].has('value')) {
      return false;
    }
  }
  return true;
}

function getValueAll(properties) {
  var result = new Array(properties.length);
  for (var i = 0; i < properties.length; i++) {
    result[i] = properties[i].get('value');
  }
  return result;
}



function withMultSource(name, mixin, noMethod) {

  function AnonymousProperty(args) {
    Property.call(this);
    this.__multSubscriber = new MultSubscriber([this.__handleBoth, this])
    this.__init(args);
  }

  inherit(AnonymousProperty, Property, {

    __name: capFirst(name) + 'Property',

    __init: function(args) {},
    __free: function() {},
    __onActivationHook: function() {},
    __onDeactivationHook: function() {},

    __handleValue: function(x, isInitial) {
      this.__send('value', x);
    },
    __handleError: function(e, isInitial) {
      this.__send('error', e);
    },

    __handleBoth: function(type, x, isInitial) {
      if (type === 'value') {
        this.__handleValue(x, isInitial);
      } else {
        this.__handleError(x, isInitial);
      }
    },

    __onActivation: function() {
      this.__multSubscriber.start();
      this.__onActivationHook();
    },
    __onDeactivation: function() {
      this.__multSubscriber.stop();
      this.__onDeactivationHook();
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__multSubscriber.clear();
      this.__multSubscriber = null;
      this.__free();
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
  this.listener = new Callable(listener);
  this.properties = [];
  this.active = false;
}

extend(MultSubscriber.prototype, {

  start: function() {
    if (!this.active) {
      for (var i = 0; i < this.properties.length; i++) {
        this.properties[i].on('both', this.listener);
      }
      this.active = true;
    }
  },
  stop: function() {
    if (this.active) {
      for (var i = 0; i < this.properties.length; i++) {
        this.properties[i].off('both', this.listener);
      }
      this.active = false;
    }
  },


  addAll: function(properties) {
    for (var i = 0; i < properties.length; i++) {
      this.add(properties[i])
    }
  },
  add: function(property) {
    this.properties.push(property);
    property.on('end', [this.remove, this, property]);
    if (property.has('value')) {
      Callable.call(this.listener, ['value', property.get('value'), true]);
    }
    if (property.has('error')) {
      Callable.call(this.listener, ['error', property.get('error'), true]);
    }
    if (this.active) {
      property.on('both', this.listener);
    }
  },
  remove: function(property) {
    for (var i = 0; i < this.properties.length; i++) {
      if (this.properties[i] === property) {
        this.properties.splice(i, 1);
        property.off('end', [this.remove, this, property]);
        if (this.active) {
          property.off('both', this.listener);
        }
        break;
      }
    }
    if (this.properties.length === 0 && this.onLastRemovedCb) {
      Callable.call(this.onLastRemovedCb);
    }
  },
  removeAll: function(){
    for (var i = 0; i < this.properties.length; i++) {
      this.properties[i].off('end', [this.remove, this, this.properties[i]]);
      if (this.active) {
        this.properties[i].off('both', this.listener);
      }
    }
    this.properties = [];
    if (this.onLastRemovedCb) {
      Callable.call(this.onLastRemovedCb);
    }
  },

  onLastRemoved: function(fn) {
    this.onLastRemovedCb = new Callable(fn);
  },
  offLastRemoved: function() {
    this.onLastRemovedCb = null;
  },
  hasProperties: function() {
    return this.properties.length > 0;
  },

  clear: function() {
    this.offLastRemoved();
    this.removeAll();
  }

});
