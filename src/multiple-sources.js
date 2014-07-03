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
    },
    __onDeactivation: function() {
      this.__multSubscriber.stop();
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__multSubscriber.removeAll();
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
  hasStreams: function() {
    return this.properties.length > 0;
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
//     return !this.alive || !this.__subr.hasStreams();
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
//     if (!this.__subr.hasStreams()) {
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













// // .combine()

// function CombinedStream(sources, mapFnMeta) {
//   Stream.call(this);
//   this.__plugged = sources;
//   for (var i = 0; i < this.__plugged.length; i++) {
//     sources[i].on('end', this.__unplugById, this, i);
//   }
//   this.__cachedValues = new Array(sources.length);
//   this.__hasValue = new Array(sources.length);
//   this.__mapFn = mapFnMeta && new Callable(mapFnMeta);
// }

// inherit(CombinedStream, Stream, {

//   __ClassName: 'CombinedStream',

//   __onFirstIn: function() {
//     for (var i = 0; i < this.__plugged.length; i++) {
//       var property = this.__plugged[i];
//       if (property) {
//         property.wathc('both', this.__handlePluggedBoth, this, i);
//       }
//     }
//   },
//   __onLastOut: function() {
//     for (var i = 0; i < this.__plugged.length; i++) {
//       var property = this.__plugged[i];
//       if (property) {
//         property.off('both', this.__handlePluggedBoth, this, i);
//       }
//     }
//   },
//   __hasNoPlugged: function() {
//     if (!this.alive) {
//       return true;
//     }
//     for (var i = 0; i < this.__plugged.length; i++) {
//       if (this.__plugged[i]) {
//         return false;
//       }
//     }
//     return true;
//   },
//   __unplugById: function(i) {
//     var property = this.__plugged[i];
//     if (property) {
//       this.__plugged[i] = null;
//       property.off('both', this.__handlePluggedBoth, this, i);
//       property.off('end', this.__unplugById, this, i);
//       if (this.__hasNoPlugged()) {
//         this.__sendEnd();
//       }
//     }
//   },
//   __handlePluggedBoth: function(i, type, x) {
//     if (type === 'value') {
//       this.__hasValue[i] = true;
//       this.__cachedValues[i] = x;
//       if (this.__allCached()) {
//         if (this.__mapFn) {
//           this.__sendAny(Callable.call(this.__mapFn, this.__cachedValues));
//         } else {
//           this.__sendValue(this.__cachedValues.slice(0));
//         }
//       }
//     } else {
//       this.__sendError(x);
//     }
//   },
//   __allCached: function() {
//     for (var i = 0; i < this.__hasValue.length; i++) {
//       if (!this.__hasValue[i]) {
//         return false;
//       }
//     }
//     return true;
//   },
//   __clear: function() {
//     Stream.prototype.__clear.call(this);
//     this.__plugged = null;
//     this.__cachedValues = null;
//     this.__hasValue = null;
//     this.__mapFn = null;
//   }

// });

// Kefir.combine = function(sources/*, fn[, context[, arg1, arg2, ...]]*/) {
//   return new CombinedStream(sources, rest(arguments, 1));
// }

// Observable.prototype.combine = function(sources/*, fn[, context[, arg1, arg2, ...]]*/) {
//   return new CombinedStream([this].concat(sources), rest(arguments, 1));
// }






// // Kefir.onValues()

// Kefir.onValues = function(properties/*, fn[, context[, arg1, agr2, ...]]*/) {
//   var fn = new Callable(rest(arguments, 1))
//   return Kefir.combine(properties).onValue(function(xs) {
//     return Callable.call(fn, xs);
//   });
// }
