// TODO
//
// observable.flatMapLatest(f)
// observable.flatMapFirst(f)
//
// observable.zip(other, f)
//
// observable.awaiting(otherObservable)
//
// stream.concat(otherStream)
//
// Kefir.onValues(a, b [, c...], f)




var PluggableMixin = {

  __initPluggable: function(){
    this.__plugged = [];
  },
  __clearPluggable: function(){
    this.__plugged = null;
  },
  __handlePlugged: function(i, value){
    this.__sendAny(value);
  },
  __plug: function(stream){
    if ( !this.isEnded() ) {
      this.__plugged.push(stream);
      var i = this.__plugged.length - 1;
      if (this.__hasSubscribers('value')) {
        stream.onValue(this.__handlePlugged, this, i);
      }
      stream.onEnd(this.__unplugById, this, i);
    }
  },
  __unplugById: function(i){
    if ( !this.isEnded() ) {
      var stream = this.__plugged[i];
      if (stream) {
        this.__plugged[i] = null;
        stream.offValue(this.__handlePlugged, this, i);
        stream.onEnd(this.__unplugById, this, i);
      }
    }
  },
  __unplug: function(stream){
    if ( !this.isEnded() ) {
      for (var i = 0; i < this.__plugged.length; i++) {
        if (this.__plugged[i] === stream) {
          this.__unplugById(i);
        }
      }
    }
  },
  __onFirstIn: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.onValue(this.__handlePlugged, this, i);
      }
    }
  },
  __onLastOut: function(){
    for (var i = 0; i < this.__plugged.length; i++) {
      var stream = this.__plugged[i];
      if (stream) {
        stream.offValue(this.__handlePlugged, this, i);
      }
    }
  },
  __hasNoPlugged: function(){
    if (this.isEnded()) {
      return true;
    }
    for (var i = 0; i < this.__plugged.length; i++) {
      if (this.__plugged[i]) {
        return false;
      }
    }
    return true;
  }

}





// Bus

Kefir.Bus = function Bus(){
  Stream.call(this);
  this.__initPluggable();
}

inherit(Kefir.Bus, Stream, PluggableMixin, {

  __ClassName: 'Bus',

  push: function(x){
    this.__sendAny(x);
  },
  plug: function(stream){
    this.__plug(stream);
  },
  unplug: function(stream){
    this.__unplug(stream);
  },
  end: function(){
    this.__sendEnd();
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
    this.push = noop;
  }

});

Kefir.bus = function(){
  return new Kefir.Bus();
}





// FlatMap

Kefir.FlatMappedStream = function FlatMappedStream(sourceStream, mapFn){
  Stream.call(this);
  this.__initPluggable();
  this.__sourceStream = sourceStream;
  this.__mapFn = mapFn;
  sourceStream.onEnd(this.__onSourceEnds, this);
}

inherit(Kefir.FlatMappedStream, Stream, PluggableMixin, {

  __ClassName: 'FlatMappedStream',

  __onSourceEnds: function(){
    if (this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  },
  __plugResult: function(x){
    this.__plug(  this.__mapFn(x)  );
  },
  __onFirstIn: function(){
    this.__sourceStream.onValue(this.__plugResult, this);
    PluggableMixin.__onFirstIn.call(this);
  },
  __onLastOut: function(){
    this.__sourceStream.offValue(this.__plugResult, this);
    PluggableMixin.__onLastOut.call(this);
  },
  __unplugById: function(i){
    PluggableMixin.__unplugById.call(this, i);
    if (!this.isEnded() && this.__hasNoPlugged() && this.__sourceStream.isEnded()) {
      this.__sendEnd();
    }
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
    this.__sourceStream = null;
    this.__mapFn = null;
  }

})

Observable.prototype.flatMap = function(fn) {
  return new Kefir.FlatMappedStream(this, fn);
};








// Merge

Kefir.MergedStream = function MergedStream(){
  Stream.call(this);
  this.__initPluggable();
  var sources = firstArrOrToArr(arguments);
  for (var i = 0; i < sources.length; i++) {
    this.__plug(sources[i]);
  }
}

inherit(Kefir.MergedStream, Stream, PluggableMixin, {

  __ClassName: 'MergedStream',

  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
  },
  __unplugById: function(i){
    PluggableMixin.__unplugById.call(this, i);
    if (this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  }

});

Kefir.merge = function() {
  return new Kefir.MergedStream(firstArrOrToArr(arguments));
}

Observable.prototype.merge = function() {
  return Kefir.merge([this].concat(firstArrOrToArr(arguments)));
}









// Combine

Kefir.CombinedStream = function CombinedStream(sources, mapFn){
  Stream.call(this);
  this.__initPluggable();
  for (var i = 0; i < sources.length; i++) {
    this.__plug(sources[i]);
  }
  this.__cachedValues = new Array(sources.length);
  this.__hasCached = new Array(sources.length);
  this.__mapFn = mapFn;
}

inherit(Kefir.CombinedStream, Stream, PluggableMixin, {

  __ClassName: 'CombinedStream',

  __unplugById: function(i){
    PluggableMixin.__unplugById.call(this, i);
    if (this.__hasNoPlugged()) {
      this.__sendEnd();
    }
  },
  __handlePlugged: function(i, x) {
    this.__hasCached[i] = true;
    this.__cachedValues[i] = x;
    if (this.__allCached()) {
      if (isFn(this.__mapFn)) {
        this.__sendAny(this.__mapFn.apply(null, this.__cachedValues));
      } else {
        this.__sendValue(this.__cachedValues.slice(0));
      }
    }
  },
  __allCached: function(){
    for (var i = 0; i < this.__hasCached.length; i++) {
      if (!this.__hasCached[i]) {
        return false;
      }
    }
    return true;
  },
  __clear: function(){
    Stream.prototype.__clear.call(this);
    this.__clearPluggable();
    this.__cachedValues = null;
    this.__hasCached = null;
    this.__mapFn = null;
  }

});

Kefir.combine = function(sources, mapFn) {
  return new Kefir.CombinedStream(sources, mapFn);
}

Observable.prototype.combine = function(sources, mapFn) {
  return Kefir.combine([this].concat(sources), mapFn);
}






// Kefir.onValues()

Kefir.onValues = function(streams, fn, context){
  return Kefir.combine(streams).onValue(function(xs){
    return fn.apply(context, xs);
  })
}
