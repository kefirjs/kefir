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
  },
  __onLastOut: function(){
    this.__source.offValue('__handle', this);
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
  if (typeof initial === 'undefined') {
    return this
  } else {
    var prop = new Kefir.PropertyFromStream(this);
    prop.__sendValue(initial);
    return prop;
  }
}





// property.changes()

Kefir.ChangesStream = function ChangesStream(source){
  Stream.call(this);
  this.__Constructor(source);
}

inherit(Kefir.ChangesStream, Stream, WithSourceStreamMixin, {
  __ClassName: 'ChangesStream'
})

Property.prototype.changes = function() {
  return new Kefir.ChangesStream(this);
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
    if (source instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFnMeta = mapFnMeta.lenght === 1 ? mapFnMeta[0] : mapFnMeta;
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this.__sendAny( callFn(this.__mapFnMeta, [x]) );
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
    return Kefir.NOTHING;
  }
}

Observable.prototype.skip = function(n) {
  return this.map(skipMapFn, {n: n});
}





// .skipDuplicates([fn])

var skipDuplicatesMapFn = function(x){
  var result;
  if (this.hasPrev && (this.fn ? this.fn(this.prev, x) : this.prev === x)) {
    result = Kefir.NOTHING;
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
    return Kefir.NOTHING;
  } else {
    this.skip = false;
    return x;
  }
}

Observable.prototype.skipWhile = function(fn) {
  return this.map(skipWhileMapFn, {skip: true, fn: fn});
}






// .sampledBy(observable, fn)

Observable.prototype.sampledBy = function(observable, fn) {
  var lastVal = Kefir.NOTHING;
  var saveLast = function(x){ lastVal = x }
  this.onValue(saveLast);
  observable.onEnd(function(){
    this.offValue(saveLast);
  }, this);
  return observable.map(function(x){
    if (lastVal !== Kefir.NOTHING) {
      return fn ? fn(lastVal, x) : lastVal;
    } else {
      return Kefir.NOTHING;
    }
  });
}
