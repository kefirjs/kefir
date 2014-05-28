var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasValue()) {
      this.__handle(source.getValue());
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

Kefir.ScanProperty = function ScanProperty(source, seed, fnMeta){
  Property.call(this, null, null, seed);
  this.__fnMeta = normFnMeta(fnMeta);
  this.__Constructor(source);
}

inherit(Kefir.ScanProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ScanProperty',

  __handle: function(x){
    this.__sendValue( callFn(this.__fnMeta, [this.getValue(), x]) );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fnMeta = null;
  }

})

Observable.prototype.scan = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.ScanProperty(this, seed, restArgs(arguments, 1));
}




// .reduce(seed, fn)

Kefir.ReducedProperty = function ReducedProperty(source, seed, fnMeta){
  Property.call(this);
  this.__fnMeta = normFnMeta(fnMeta);
  this.__result = seed;
  source.onEnd('__sendResult', this);
  this.__Constructor(source);
}

inherit(Kefir.ReducedProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ReducedProperty',

  __handle: function(x){
    this.__result = callFn(this.__fnMeta, [this.__result, x]);
  },
  __sendResult: function(){
    this.__sendValue(this.__result);
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__fnMeta = null;
    this.__result = null;
  }

});

Observable.prototype.reduce = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new Kefir.ReducedProperty(this, seed, restArgs(arguments, 1));
}




// .map(fn)

var MapMixin = {
  __Constructor: function(source, mapFnMeta){
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFnMeta = normFnMeta(mapFnMeta);
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
  var result = callFn(this.fnMeta, [this.prev, x]);
  this.prev = x;
  return result;
}

Observable.prototype.diff = function(start/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(diffMapFn, {
    prev: start,
    fnMeta: normFnMeta(restArgs(arguments, 1))
  });
}





// .filter(fn)

var filterMapFn = function(filterFnMeta, x){
  if (callFn(filterFnMeta, [x])) {
    return x;
  } else {
    return NOTHING;
  }
}

Observable.prototype.filter = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(filterMapFn, null, normFnMeta(arguments));
}




// .takeWhile(fn)

var takeWhileMapFn = function(fnMeta, x) {
  if (callFn(fnMeta, [x])) {
    return x;
  } else {
    return END;
  }
}

Observable.prototype.takeWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(takeWhileMapFn, null, normFnMeta(arguments));
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
  if (this.prev !== NOTHING && (this.fn ? this.fn(this.prev, x) : this.prev === x)) {
    result = NOTHING;
  } else {
    result = x;
  }
  this.hasPrev = true;
  this.prev = x;
  return result;
}

Observable.prototype.skipDuplicates = function(fn) {
  return this.map(skipDuplicatesMapFn, {fn: fn, prev: NOTHING});
}





// .skipWhile(f)

var skipWhileMapFn = function(x){
  if (this.skip && callFn(this.fnMeta, [x])) {
    return NOTHING;
  } else {
    this.skip = false;
    return x;
  }
}

Observable.prototype.skipWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return this.map(skipWhileMapFn, {skip: true, fnMeta: normFnMeta(arguments)});
}






