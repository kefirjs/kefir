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






// var PluggableMixin = {

//   __initPluggable: function() {
//     this.__subr = new MultSubscriber(this.__handlePluggedBoth, this);
//   },
//   __clearPluggable: function() {
//     this.__subr = null;
//   },
//   __handlePluggedBoth: function(type, value) {
//     if (type === 'value') {
//       this.__sendAny(value);
//     } else {
//       this.__sendError(value);
//     }
//   },
//   __plug: function(property) {
//     if (this.alive) {
//       this.__subr.add(property);
//     }
//   },
//   __unplug: function(property) {
//     if (this.alive) {
//       this.__subr.remove(property);
//     }
//   },
//   __onFirstIn: function() {
//     this.__subr.start();
//   },
//   __onLastOut: function() {
//     this.__subr.stop();
//   },
//   __hasNoPlugged: function() {
//     return !this.alive || !this.__subr.hasProperties();
//   }

// }





// // Kefir.bus()

// function Bus() {
//   Stream.call(this);
//   this.__initPluggable();
// }

// inherit(Bus, Stream, PluggableMixin, {

//   __ClassName: 'Bus',

//   push: function(x) {
//     this.__sendAny(x);
//     return this;
//   },
//   error: function(e) {
//     this.__sendError(e);
//     return this;
//   },
//   plug: function(property) {
//     this.__plug(property);
//     return this;
//   },
//   unplug: function(property) {
//     this.__unplug(property);
//     return this;
//   },
//   end: function() {
//     this.__sendEnd();
//     return this;
//   },
//   __clear: function() {
//     Stream.prototype.__clear.call(this);
//     this.__clearPluggable();
//   }

// });

// Kefir.bus = function() {
//   return new Bus();
// }





// // .flatMap()

// function FlatMappedStream(sourceStream, mapFnMeta) {
//   Stream.call(this);
//   this.__sourceStream = sourceStream;
//   this.__mapFn = new Callable(mapFnMeta);
//   this.__subr = new MultSubscriber(this.__handlePluggedBoth, this);
//   sourceStream.on('end', this.__onSourceEnds, this);
//   this.__subr.onLastRemoved(this.__onPluggedEnds, this);
// }

// inherit(FlatMappedStream, Stream, {

//   __ClassName: 'FlatMappedStream',

//   __onSourceEnds: function() {
//     if (!this.__subr.hasProperties()) {
//       this.__sendEnd();
//     }
//   },
//   __onPluggedEnds: function() {
//     if (this.alive && this.__sourceStream.isEnded()) {
//       this.__sendEnd();
//     }
//   },
//   __plugResult: function(x) {
//     this.__subr.add(Callable.call(this.__mapFn, [x]));
//   },
//   __hadleSourceBoth: function(type, x) {
//     if (type === 'value') {
//       this.__plugResult(x);
//     } else {
//       this.__sendError(x);
//     }
//   },
//   __handlePluggedBoth: function(type, value) {
//     if (type === 'value') {
//       this.__sendAny(value);
//     } else {
//       this.__sendError(value);
//     }
//   },
//   __onFirstIn: function() {
//     this.__sourceStream.wathc('both', this.__hadleSourceBoth, this);
//     this.__subr.start();
//   },
//   __onLastOut: function() {
//     this.__sourceStream.off('both', this.__hadleSourceBoth, this);
//     this.__subr.stop();
//   },
//   __clear: function() {
//     Stream.prototype.__clear.call(this);
//     this.__subr = null;
//     this.__sourceStream = null;
//     this.__mapFn = null;
//   }

// })

// Observable.prototype.flatMap = function(/*fn[, context[, arg1, arg2, ...]]*/) {
//   return new FlatMappedStream(this, arguments);
// };

// // function FlatMappedStream(sourceStream, mapFnMeta) {
// //   Stream.call(this);
// //   this.__initPluggable();
// //   this.__subr.onLastRemoved(function() {
// //     if (this.alive && this.__sourceStream.isEnded()) {
// //       this.__sendEnd();
// //     }
// //   }, this)
// //   this.__sourceStream = sourceStream;
// //   this.__mapFn = new Callable(mapFnMeta);
// //   sourceStream.on('end', this.__onSourceEnds, this);
// // }

// // inherit(FlatMappedStream, Stream, PluggableMixin, {

// //   __ClassName: 'FlatMappedStream',

// //   __onSourceEnds: function() {
// //     if (this.__hasNoPlugged()) {
// //       this.__sendEnd();
// //     }
// //   },
// //   __plugResult: function(x) {
// //     this.__plug(Callable.call(this.__mapFn, [x]));
// //   },
// //   __hadleSourceBoth: function(type, x) {
// //     if (type === 'value') {
// //       this.__plugResult(x);
// //     } else {
// //       this.__sendError(x);
// //     }
// //   },
// //   __onFirstIn: function() {
// //     this.__sourceStream.wathc('both', this.__hadleSourceBoth, this);
// //     PluggableMixin.__onFirstIn.call(this);
// //   },
// //   __onLastOut: function() {
// //     this.__sourceStream.off('both', this.__hadleSourceBoth, this);
// //     PluggableMixin.__onLastOut.call(this);
// //   },
// //   __clear: function() {
// //     Stream.prototype.__clear.call(this);
// //     this.__clearPluggable();
// //     this.__sourceStream = null;
// //     this.__mapFn = null;
// //   }

// // })

// // Observable.prototype.flatMap = function(/*fn[, context[, arg1, arg2, ...]]*/) {
// //   return new FlatMappedStream(this, arguments);
// // };




// // .flatMapLatest()

// function FlatMapLatestStream() {
//   FlatMappedStream.apply(this, arguments);
// }

// inherit(FlatMapLatestStream, FlatMappedStream, {

//   __ClassName: 'FlatMapLatestStream',

//   __plugResult: function(x) {
//     this.__subr.removeAll();
//     FlatMappedStream.prototype.__plugResult.call(this, x);
//   }

// })

// Observable.prototype.flatMapLatest = function(/*fn[, context[, arg1, arg2, ...]]*/) {
//   return new FlatMapLatestStream(this, arguments);
// };









// // Kefir.onValues()

// Kefir.onValues = function(properties/*, fn[, context[, arg1, agr2, ...]]*/) {
//   var fn = new Callable(rest(arguments, 1))
//   return Kefir.combine(properties).onValue(function(xs) {
//     return Callable.call(fn, xs);
//   });
// }
