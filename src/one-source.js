// TODO
//
// stream.skipWhile(f)
// observable.skip(n)
//
// observable.scan(seed, f)
// observable.diff(start, f)
//
// observable.skipDuplicates(isEqual)



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
    this.__source.onNewValue(this.__handle, this);
  },
  __onLastOut: function(){
    this.__source.offValue(this.__handle, this);
  },
  __clear: function(){
    Observable.prototype.__clear.call(this);
    this.__source = null;
  }
}





// observable.toProperty()

Kefir.PropertyFromStream = function PropertyFromStream(source, initial){
  Property.call(this, null, null, initial);
  this.__Constructor.call(this, source);
}

inherit(Kefir.PropertyFromStream, Property, WithSourceStreamMixin, {
  __ClassName: 'PropertyFromStream'
})

Stream.prototype.toProperty = function(initial){
  return new Kefir.PropertyFromStream(this, initial);
}

Property.prototype.toProperty = function(initial){
  if (typeof initial === "undefined") {
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
  this.__Constructor.call(this, source);
}

inherit(Kefir.ChangesStream, Stream, WithSourceStreamMixin, {
  __ClassName: 'ChangesStream'
})

Property.prototype.changes = function() {
  return new Kefir.ChangesStream(this);
}






// Map

var MapMixin = {
  __Constructor: function(source, mapFn){
    if (source instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFn = mapFn;
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this.__sendAny( this.__mapFn(x) );
  },
  __clear: function(){
    WithSourceStreamMixin.__clear.call(this);
    this.__mapFn = null;
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

Stream.prototype.map = function(fn) {
  return new Kefir.MappedStream(this, fn);
}

Property.prototype.map = function(fn) {
  return new Kefir.MappedProperty(this, fn);
}





// Filter

Observable.prototype.filter = function(fn) {
  return this.map(function(x){
    if (fn(x)) {
      return x;
    } else {
      return NOTHING;
    }
  })
}




// TakeWhile

Observable.prototype.takeWhile = function(fn) {
  return this.map(function(x){
    if (fn(x)) {
      return x;
    } else {
      return END;
    }
  })
}




// Take

Observable.prototype.take = function(n) {
  return this.map(function(x){
    if (n <= 0) {
      return END;
    }
    if (n === 1) {
      return Kefir.bunch(x, END);
    }
    n--;
    return x;
  })
}
