// TODO
//
// observable.fold(seed, f) / observable.reduce(seed, f)
//
// observable.filter(property)
// observable.takeWhile(property)
// observable.skipWhile(property)


var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasCached()) {
      this.__handle(source.getCached());
    }
  },
  __handle: function(x){
    this.__sendAny(x);
  },
  __onFirstIn: function(){
    this.__source.onNewValue('__handle', this);
    this.__source.onError('__sendError', this);
  },
  __onLastOut: function(){
    this.__source.offValue('__handle', this);
    this.__source.offError('__sendError', this);
  },
  __clear: function(){
    Observable.prototype.__clear.call(this);
    this.__source = null;
  }
}





// observable.toProperty([initial])

Kefir.PropertyFromStream = function PropertyFromStream(source, initial){
  Property.call(this, null, null, initial);
  this.__Constructor(source);
}

inherit(Kefir.PropertyFromStream, Property, WithSourceStreamMixin, {
  __ClassName: 'PropertyFromStream'
})

Stream.prototype.toProperty = function(initial){
  return new Kefir.PropertyFromStream(this, initial);
}

Property.prototype.toProperty = function(initial){
  if (isUndefined(initial)) {
    return this
  } else {
    var prop = new Kefir.PropertyFromStream(this);
    prop.__sendValue(initial);
    return prop;
  }
}






// .scan(seed, fn)

Kefir.ScanProperty = function ScanProperty(source, seed, fn){
  Property.call(this, null, null, seed);
  this.__fn = fn;
  this.__Constructor(source);
}

inherit(Kefir.ScanProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ScanProperty',

  __handle: function(x){
    this.__sendValue( this.__fn(this.getCached(), x) );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fn = null;
  }

})

Observable.prototype.scan = function(seed, fn) {
  return new Kefir.ScanProperty(this, seed, fn);
}




// .map(fn)

var MapMixin = {
  __Constructor: function(source, mapFnMeta){
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFnMeta = mapFnMeta ? (
      mapFnMeta.lenght === 1 ?
        mapFnMeta[0] :
        mapFnMeta
    ) : null;
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this.__sendAny(
      this.__mapFnMeta ? callFn(this.__mapFnMeta, [x]) : x
    );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__mapFnMeta = null;
  }
}
inheritMixin(MapMixin, WithSourceStreamMixin);

Kefir.MappedStream = function MappedStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.MappedStream, Stream, MapMixin, {
  __ClassName: 'MappedStream'
});

Kefir.MappedProperty = function MappedProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.MappedProperty, Property, MapMixin, {
  __ClassName: 'MappedProperty'
})

Stream.prototype.map = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.MappedStream(this, arguments);
}

Property.prototype.map = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.MappedProperty(this, arguments);
}




// property.changes()

Property.prototype.changes = function() {
  return new Kefir.MappedStream(this);
}




// .diff(seed, fn)

var diffMapFn = function(x){
  var result = this.fn(this.prev, x);
  this.prev = x;
  return result;
}

Observable.prototype.diff = function(start, fn) {
  return this.map(diffMapFn, {prev: start, fn: fn});
}





// .filter(fn)

var filterMapFn = function(filterFn, x){
  if (filterFn(x)) {
    return x;
  } else {
    return NOTHING;
  }
}

Observable.prototype.filter = function(fn) {
  return this.map(filterMapFn, null, fn);
}




// .takeWhile(fn)

var takeWhileMapFn = function(fn, x) {
  if (fn(x)) {
    return x;
  } else {
    return END;
  }
}

Observable.prototype.takeWhile = function(fn) {
  return this.map(takeWhileMapFn, null, fn);
}




// .take(n)

var takeMapFn = function(x) {
  if (this.n <= 0) {
    return END;
  }
  if (this.n === 1) {
    return Kefir.bunch(x, END);
  }
  this.n--;
  return x;
}

Observable.prototype.take = function(n) {
  return this.map(takeMapFn, {n: n});
}




// .skip(n)

var skipMapFn = function(x) {
  if (this.n <= 0) {
    return x;
  } else {
    this.n--;
    return NOTHING;
  }
}

Observable.prototype.skip = function(n) {
  return this.map(skipMapFn, {n: n});
}





// .skipDuplicates([fn])

var skipDuplicatesMapFn = function(x){
  var result;
  if (this.hasPrev && (this.fn ? this.fn(this.prev, x) : this.prev === x)) {
    result = NOTHING;
  } else {
    result = x;
  }
  this.hasPrev = true;
  this.prev = x;
  return result;
}

Observable.prototype.skipDuplicates = function(fn) {
  return this.map(skipDuplicatesMapFn, {fn: fn, hasPrev: false, prev: null});
}





// .skipWhile(f)

var skipWhileMapFn = function(x){
  if (this.skip && this.fn(x)) {
    return NOTHING;
  } else {
    this.skip = false;
    return x;
  }
}

Observable.prototype.skipWhile = function(fn) {
  return this.map(skipWhileMapFn, {skip: true, fn: fn});
}






// .sampledBy(observable, fn)

var SampledByMixin = {
  __Constructor: function(main, sampler, fn){
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    WithSourceStreamMixin.__Constructor.call(this, sampler);
    this.__lastValue = NOTHING;
    this.__fn = fn;
    this.__mainStream = main;
  },
  __handle: function(y){
    if (this.__lastValue !== NOTHING) {
      var x = this.__lastValue;
      if (this.__fn) {
        x = this.__fn(x, y);
      }
      this.__sendValue(x);
    }
  },
  __onFirstIn: function(){
    WithSourceStreamMixin.__onFirstIn.call(this);
    this.__mainStream.onValue('__saveValue', this);
    this.__mainStream.onError('__sendError', this);
  },
  __onLastOut: function(){
    WithSourceStreamMixin.__onLastOut.call(this);
    this.__mainStream.offValue('__saveValue', this);
    this.__mainStream.offError('__sendError', this);
  },
  __saveValue: function(x){
    this.__lastValue = x;
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__lastValue = null;
    this.__fn = null;
    this.__mainStream = null;
  }
}

inheritMixin(SampledByMixin, WithSourceStreamMixin);

Kefir.SampledByStream = function SampledByStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.SampledByStream, Stream, SampledByMixin, {
  __ClassName: 'SampledByStream',
})

Kefir.SampledByProperty = function SampledByProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.SampledByProperty, Property, SampledByMixin, {
  __ClassName: 'SampledByProperty',
})

Observable.prototype.sampledBy = function(observable, fn) {
  if (observable instanceof Stream) {
    return new Kefir.SampledByStream(this, observable, fn);
  } else {
    return new Kefir.SampledByProperty(this, observable, fn);
  }
}
