// TODO
// stream.skipWhile(f)
// observable.skip(n)
//
// observable.scan(seed, f)
// observable.diff(start, f)
//
// observable.skipDuplicates(isEqual)



var withHandlerMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasCached()) {
      this.__handle(source.getCached());
    }
  },
  __handle: function(x){
    this._send(x);
  },
  __onFirstIn: function(){
    this.__source.onChanges(this.__handle, this);
  },
  __onLastOut: function(){
    this.__source.off(this.__handle, this);
  },
  __end: function(){
    this.__source = null;
  }
}





Kefir.PropertyFromStream = inherit(function PropertyFromStream(source, initial){
  assertStream(source);
  Property.call(this, null, null, initial);
  this.__Constructor.call(this, source);
}, Property, extend({}, withHandlerMixin, {

  __ClassName: 'PropertyFromStream',
  __objName: 'stream.toProperty()',
  __end: function(){
    Property.prototype.__end.call(this);
    withHandlerMixin.__end.call(this);
  }

}))

Stream.prototype.toProperty = function(initial){
  return new Kefir.PropertyFromStream(this, initial);
}




// Property::changes()

Kefir.ChangesStream = inherit(function ChangesStream(source){
  assertProperty(source);
  Stream.call(this);
  this.__Constructor.call(this, source);
}, Stream, extend({}, withHandlerMixin, {

  __ClassName: 'ChangesStream',
  __objName: 'property.changes()',
  __end: function(){
    Stream.prototype.__end.call(this);
    withHandlerMixin.__end.call(this);
  }

}))

Property.prototype.changes = function() {
  return new Kefir.ChangesStream(this);
};







// Map

var mapMixin = extend({}, withHandlerMixin, {
  __Constructor: function(source, mapFn){
    if (source instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFn = mapFn;
    withHandlerMixin.__Constructor.call(this, source);
  },
  __handle: function(x){
    this._send( this.__mapFn(x) );
  },
  __end: function(){
    Stream.prototype.__end.call(this);
    withHandlerMixin.__end.call(this);
    this.__mapFn = null;
  }
});

Kefir.MappedStream = inherit(
  function MappedStream(){this.__Constructor.apply(this, arguments)},
  Stream, mapMixin
);
Kefir.MappedStream.prototype.__ClassName = 'MappedStream'

Kefir.MappedProperty = inherit(
  function MappedProperty(){this.__Constructor.apply(this, arguments)},
  Property, mapMixin
);
Kefir.MappedProperty.prototype.__ClassName = 'MappedProperty'


Observable.prototype.map = function(fn) {
  if (this instanceof Property) {
    return new Kefir.MappedProperty(this, fn);
  } else {
    return new Kefir.MappedStream(this, fn);
  }
};







// Filter

var filterMixin = extend({}, mapMixin, {
  __handle: function(x){
    if (this.__mapFn(x)) {
      this._send(x);
    }
  }
});

Kefir.FilteredStream = inherit(
  function FilteredStream(){this.__Constructor.apply(this, arguments)},
  Stream, filterMixin
);
Kefir.FilteredStream.prototype.__ClassName = 'FilteredStream'

Kefir.FilteredProperty = inherit(
  function FilteredProperty(){this.__Constructor.apply(this, arguments)},
  Property, filterMixin
);
Kefir.FilteredProperty.prototype.__ClassName = 'FilteredProperty'

Observable.prototype.filter = function(fn) {
  if (this instanceof Property) {
    return new Kefir.FilteredProperty(this, fn);
  } else {
    return new Kefir.FilteredStream(this, fn);
  }
};





// TakeWhile

var takeWhileMixin = extend({}, mapMixin, {
  __handle: function(x){
    if (this.__mapFn(x)) {
      this._send(x);
    } else {
      this._send(Kefir.END);
    }
  }
});

Kefir.TakeWhileStream = inherit(
  function TakeWhileStream(){this.__Constructor.apply(this, arguments)},
  Stream, takeWhileMixin
);
Kefir.TakeWhileStream.prototype.__ClassName = 'TakeWhileStream'

Kefir.TakeWhileProperty = inherit(
  function TakeWhileProperty(){this.__Constructor.apply(this, arguments)},
  Property, takeWhileMixin
);
Kefir.TakeWhileProperty.prototype.__ClassName = 'TakeWhileProperty'

Observable.prototype.takeWhile = function(fn) {
  if (this instanceof Property) {
    return new Kefir.TakeWhileProperty(this, fn);
  } else {
    return new Kefir.TakeWhileStream(this, fn);
  }
};




// Take

Observable.prototype.take = function(n) {
  return withName('observable.take(n)', this.takeWhile(function(){
    return n-- > 0;
  }))
};
