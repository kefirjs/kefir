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
    this.__source = null;
  }
}





// .toProperty()

Kefir.PropertyFromStream = function PropertyFromStream(source, initial){
  Property.call(this, null, null, initial);
  this.__Constructor.call(this, source);
}

inherit(Kefir.PropertyFromStream, Property, WithSourceStreamMixin, {

  __ClassName: 'PropertyFromStream',
  __objName: 'stream.toProperty()',
  __clear: function(){
    Property.prototype.__clear.call(this);
    WithSourceStreamMixin.__clear.call(this);
  }

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





// Property::changes()

Kefir.ChangesStream = function ChangesStream(source){
  assertProperty(source);
  Stream.call(this);
  this.__Constructor.call(this, source);
}

inherit(Kefir.ChangesStream, Stream, WithSourceStreamMixin, {

  __ClassName: 'ChangesStream',
  __objName: 'property.changes()',
  __clear: function(){
    Stream.prototype.__clear.call(this);
    WithSourceStreamMixin.__clear.call(this);
  }

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
    Stream.prototype.__clear.call(this);
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

Observable.prototype.map = function(fn) {
  if (this instanceof Property) {
    return new Kefir.MappedProperty(this, fn);
  } else {
    return new Kefir.MappedStream(this, fn);
  }
}






// Filter

var filterMixin = {
  __handle: function(x){
    if (this.__mapFn(x)) {
      this.__sendValue(x);
    }
  }
}
inheritMixin(filterMixin, MapMixin);

Kefir.FilteredStream = function FilteredStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.FilteredStream, Stream, filterMixin, {
  __ClassName: 'FilteredStream'
})

Kefir.FilteredProperty = function FilteredProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.FilteredProperty, Property, filterMixin, {
  __ClassName: 'FilteredProperty'
})

Observable.prototype.filter = function(fn) {
  if (this instanceof Property) {
    return new Kefir.FilteredProperty(this, fn);
  } else {
    return new Kefir.FilteredStream(this, fn);
  }
}





// TakeWhile

var TakeWhileMixin = {
  __handle: function(x){
    if (this.__mapFn(x)) {
      this.__sendValue(x);
    } else {
      this.__sendEnd();
    }
  }
}
inheritMixin(TakeWhileMixin, MapMixin);

Kefir.TakeWhileStream = function TakeWhileStream(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.TakeWhileStream, Stream, TakeWhileMixin, {
  __ClassName: 'TakeWhileStream'
})

Kefir.TakeWhileProperty = function TakeWhileProperty(){
  this.__Constructor.apply(this, arguments);
}

inherit(Kefir.TakeWhileProperty, Property, TakeWhileMixin, {
  __ClassName: 'TakeWhileStream'
})

Observable.prototype.takeWhile = function(fn) {
  if (this instanceof Property) {
    return new Kefir.TakeWhileProperty(this, fn);
  } else {
    return new Kefir.TakeWhileStream(this, fn);
  }
}




// Take

Observable.prototype.take = function(n) {
  return withName('observable.take(n)', this.takeWhile(function(){
    return n-- > 0;
  }))
};
