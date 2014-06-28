// function MultSubscriber() {
//   this.listener = new Callable(arguments);
//   this.streams = [];
//   this.active = false;
// }

// extend(MultSubscriber.prototype, {

//   start: function() {
//     for (var i = 0; i < this.streams.length; i++) {
//       this.streams[i].onBoth(this.listener);
//     }
//     this.active = true;
//   },
//   stop: function() {
//     for (var i = 0; i < this.streams.length; i++) {
//       this.streams[i].offBoth(this.listener);
//     }
//     this.active = false;
//   },

//   add: function(stream) {
//     this.streams.push(stream);
//     stream.onEnd(this.remove, this, stream);
//     if (this.active) {
//       stream.onBoth(this.listener);
//     }
//   },
//   remove: function(stream) {
//     for (var i = 0; i < this.streams.length; i++) {
//       if (this.streams[i] === stream) {
//         this.streams.splice(i, 1);
//         stream.offEnd(this.remove, this, stream);
//         if (this.active) {
//           stream.offBoth(this.listener);
//         }
//         break;
//       }
//     }
//     if (this.streams.length === 0 && this.onLastRemovedCb) {
//       Callable.call(this.onLastRemovedCb);
//     }
//   },
//   removeAll: function(){
//     for (var i = 0; i < this.streams.length; i++) {
//       this.streams[i].offEnd(this.remove, this, this.streams[i]);
//       if (this.active) {
//         this.streams[i].offBoth(this.listener);
//       }
//     }
//     this.streams = [];
//     if (this.onLastRemovedCb) {
//       Callable.call(this.onLastRemovedCb);
//     }
//   },

//   onLastRemoved: function() {
//     this.onLastRemovedCb = new Callable(arguments);
//   },
//   hasStreams: function() {
//     return this.streams.length > 0;
//   }

// })



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
//   __plug: function(stream) {
//     if (this.alive) {
//       this.__subr.add(stream);
//     }
//   },
//   __unplug: function(stream) {
//     if (this.alive) {
//       this.__subr.remove(stream);
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
//   plug: function(stream) {
//     this.__plug(stream);
//     return this;
//   },
//   unplug: function(stream) {
//     this.__unplug(stream);
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
//   sourceStream.onEnd(this.__onSourceEnds, this);
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
//     this.__sourceStream.onBoth(this.__hadleSourceBoth, this);
//     this.__subr.start();
//   },
//   __onLastOut: function() {
//     this.__sourceStream.offBoth(this.__hadleSourceBoth, this);
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
// //   sourceStream.onEnd(this.__onSourceEnds, this);
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
// //     this.__sourceStream.onBoth(this.__hadleSourceBoth, this);
// //     PluggableMixin.__onFirstIn.call(this);
// //   },
// //   __onLastOut: function() {
// //     this.__sourceStream.offBoth(this.__hadleSourceBoth, this);
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




// // .merge()

// function MergedStream() {
//   Stream.call(this);
//   this.__initPluggable();
//   this.__subr.onLastRemoved(this.__sendEnd, this);
//   var sources = agrsToArray(arguments);
//   for (var i = 0; i < sources.length; i++) {
//     this.__plug(sources[i]);
//   }
// }

// inherit(MergedStream, Stream, PluggableMixin, {

//   __ClassName: 'MergedStream',

//   __clear: function() {
//     Stream.prototype.__clear.call(this);
//     this.__clearPluggable();
//   }


// });

// Kefir.merge = function() {
//   return new MergedStream(agrsToArray(arguments));
// }

// Observable.prototype.merge = function() {
//   return Kefir.merge([this].concat(agrsToArray(arguments)));
// }









// // .combine()

// function CombinedStream(sources, mapFnMeta) {
//   Stream.call(this);
//   this.__plugged = sources;
//   for (var i = 0; i < this.__plugged.length; i++) {
//     sources[i].onEnd(this.__unplugById, this, i);
//   }
//   this.__cachedValues = new Array(sources.length);
//   this.__hasValue = new Array(sources.length);
//   this.__mapFn = mapFnMeta && new Callable(mapFnMeta);
// }

// inherit(CombinedStream, Stream, {

//   __ClassName: 'CombinedStream',

//   __onFirstIn: function() {
//     for (var i = 0; i < this.__plugged.length; i++) {
//       var stream = this.__plugged[i];
//       if (stream) {
//         stream.onBoth(this.__handlePluggedBoth, this, i);
//       }
//     }
//   },
//   __onLastOut: function() {
//     for (var i = 0; i < this.__plugged.length; i++) {
//       var stream = this.__plugged[i];
//       if (stream) {
//         stream.offBoth(this.__handlePluggedBoth, this, i);
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
//     var stream = this.__plugged[i];
//     if (stream) {
//       this.__plugged[i] = null;
//       stream.offBoth(this.__handlePluggedBoth, this, i);
//       stream.offEnd(this.__unplugById, this, i);
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

// Kefir.onValues = function(streams/*, fn[, context[, arg1, agr2, ...]]*/) {
//   var fn = new Callable(rest(arguments, 1))
//   return Kefir.combine(streams).onValue(function(xs) {
//     return Callable.call(fn, xs);
//   });
// }
