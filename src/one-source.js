var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasValue()) {
      this.__handle(source.getValue());
    }
  },
  __handle: function(x) {
    this.__sendAny(x);
  },
  __onFirstIn: function() {
    this.__source.onNewValue(this.__handle, this);
    this.__source.onError(this.__sendError, this);
  },
  __onLastOut: function() {
    this.__source.offValue(this.__handle, this);
    this.__source.offError(this.__sendError, this);
  },
  __clear: function() {
    Observable.prototype.__clear.call(this);
    this.__source = null;
  }
}





// observable.toProperty([initial])

var PropertyFromStream = function PropertyFromStream(source, initial) {
  Property.call(this, null, null, initial);
  this.__Constructor(source);
}

inherit(PropertyFromStream, Property, WithSourceStreamMixin, {
  __ClassName: 'PropertyFromStream'
})

Stream.prototype.toProperty = function(initial) {
  return new PropertyFromStream(this, initial);
}

Property.prototype.toProperty = function(initial) {
  if (isUndefined(initial)) {
    return this
  } else {
    var prop = new PropertyFromStream(this);
    prop.__sendValue(initial);
    return prop;
  }
}






// .scan(seed, fn)

var ScanProperty = function ScanProperty(source, seed, fnMeta) {
  Property.call(this, null, null, seed);
  this.__fn = new Callable(fnMeta);
  this.__Constructor(source);
}

inherit(ScanProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ScanProperty',

  __handle: function(x) {
    this.__sendValue(Callable.call(this.__fn, [this.getValue(), x]));
  },
  __clear: function() {
    WithSourceStreamMixin.__clear.call(this);
    this.__fn = null;
  }

})

Observable.prototype.scan = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new ScanProperty(this, seed, rest(arguments, 1));
}




// .reduce(seed, fn)

var ReducedProperty = function ReducedProperty(source, seed, fnMeta) {
  Property.call(this);
  this.__fn = new Callable(fnMeta);
  this.__result = seed;
  source.onEnd('__sendResult', this);
  this.__Constructor(source);
}

inherit(ReducedProperty, Property, WithSourceStreamMixin, {

  __ClassName: 'ReducedProperty',

  __handle: function(x) {
    this.__result = Callable.call(this.__fn, [this.__result, x]);
  },
  __sendResult: function() {
    this.__sendValue(this.__result);
  },
  __clear: function() {
    WithSourceStreamMixin.__clear.call(this);
    this.__fn = null;
    this.__result = null;
  }

});

Observable.prototype.reduce = function(seed/*fn[, context[, arg1, arg2, ...]]*/) {
  return new ReducedProperty(this, seed, rest(arguments, 1));
}




// .map(fn)

var MapMixin = {
  __Constructor: function(source, mapFnMeta) {
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__mapFn = mapFnMeta && new Callable(mapFnMeta);
    WithSourceStreamMixin.__Constructor.call(this, source);
  },
  __handle: function(x) {
    this.__sendAny(
      this.__mapFn ? Callable.call(this.__mapFn, [x]) : x
    );
  },
  __clear: function() {
    WithSourceStreamMixin.__clear.call(this);
    this.__mapFn = null;
  }
}
inheritMixin(MapMixin, WithSourceStreamMixin);

var MappedStream = function MappedStream() {
  this.__Constructor.apply(this, arguments);
}

inherit(MappedStream, Stream, MapMixin, {
  __ClassName: 'MappedStream'
});

var MappedProperty = function MappedProperty() {
  this.__Constructor.apply(this, arguments);
}

inherit(MappedProperty, Property, MapMixin, {
  __ClassName: 'MappedProperty'
})

Stream.prototype.map = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new MappedStream(this, arguments);
}

Property.prototype.map = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  return new MappedProperty(this, arguments);
}




// property.changes()

Property.prototype.changes = function() {
  return new MappedStream(this);
}




// .diff(seed, fn)

Observable.prototype.diff = function(start/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(rest(arguments, 1));
  var prev = start;
  return this.map(function(x) {
    var result = Callable.call(fn, [prev, x]);
    prev = x;
    return result;
  });
}





// .filter(fn)

Observable.prototype.filter = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(arguments);
  return this.map(function(x) {
    if (Callable.call(fn, [x])) {
      return x;
    } else {
      return NOTHING;
    }
  });
}




// .takeWhile(fn)

Observable.prototype.takeWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(arguments);
  return this.map(function(x) {
    if (Callable.call(fn, [x])) {
      return x;
    } else {
      return END;
    }
  });
}




// .take(n)

Observable.prototype.take = function(n) {
  return this.map(function(x) {
    if (n <= 0) {
      return END;
    }
    if (n === 1) {
      return Kefir.bunch(x, END);
    }
    n--;
    return x;
  });
}




// .skip(n)

Observable.prototype.skip = function(n) {
  return this.map(function(x) {
    if (n <= 0) {
      return x;
    } else {
      n--;
      return NOTHING;
    }
  });
}





// .skipDuplicates([fn])

Observable.prototype.skipDuplicates = function(fn) {
  var prev = NOTHING;
  return this.map(function(x) {
    var result;
    if (prev !== NOTHING && (fn ? fn(prev, x) : prev === x)) {
      result = NOTHING;
    } else {
      result = x;
    }
    prev = x;
    return result;
  });
}





// .skipWhile(fn)

Observable.prototype.skipWhile = function(/*fn[, context[, arg1, arg2, ...]]*/) {
  var fn = new Callable(arguments);
  var skip = true;
  return this.map(function(x) {
    if (skip && Callable.call(fn, [x])) {
      return NOTHING;
    } else {
      skip = false;
      return x;
    }
  });
}
