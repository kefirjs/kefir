function createOneSourceClasses(classNamePrefix, methodName, methods) {

  var defaultMethods = {
    __init: function(args) {},
    __clean: function() {},
    __handleValue: function(x, initial) {  this.__sendValue(x)  },
    __handleError: function(e) {  this.__sendError(e)  },
    __handleEnd: function() {  this.__sendEnd()  }
  }

  var mixin = extend({
    __handleErrorOrValue: function(type, x) {
      if (type === 'value') {
        this.__handleValue(x);
      } else {
        this.__handleError(x);
      }
    },
    __onFirstIn: function() {
      this.__source.onNewBoth(this.__handleErrorOrValue, this);
    },
    __onLastOut: function() {
      this.__source.offBoth(this.__handleErrorOrValue, this);
    }
  }, defaultMethods, methods);


  function AnonymousStream(source, args) {
    Stream.call(this);
    this.__source = source;
    source.onEnd(this.__handleEnd, this);
    this.__init(args);
  }

  inherit(AnonymousStream, Stream, mixin, {
    __ClassName: classNamePrefix + 'Stream',
    __clear: function() {
      Stream.prototype.__clear.call(this);
      this.__source = null;
      this.__clean();
    }
  });


  function AnonymousProperty(source, args) {
    Property.call(this);
    this.__source = source;
    source.onEnd(this.__handleEnd, this);
    this.__init(args);
    if (source instanceof Property && source.hasValue()) {
      this.__handleValue(source.getValue(), true);
    }
  }

  inherit(AnonymousProperty, Property, mixin, {
    __ClassName: classNamePrefix + 'Property',
    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__source = null;
      this.__clean();
    }
  });


  if (methodName) {
    Stream.prototype[methodName] = function() {
      return new AnonymousStream(this, arguments);
    }
    Property.prototype[methodName] = function() {
      return new AnonymousProperty(this, arguments);
    }
  }


  return {
    Stream: AnonymousStream,
    Property: AnonymousProperty
  };
}





// .map(fn)

createOneSourceClasses(
  'Mapped',
  'map',
  {
    __init: function(args) {
      this.__fn = new Callable(args);
    },
    __clean: function() {
      this.__fn = null;
    },
    __handleValue: function(x) {
      this.__sendAny(Callable.call(this.__fn, [x]));
    }
  }
)





// .filter(fn)

createOneSourceClasses(
  'Filtered',
  'filter',
  {
    __init: function(args) {
      this.__fn = new Callable(args);
    },
    __clean: function() {
      this.__fn = null;
    },
    __handleValue: function(x) {
      if (Callable.call(this.__fn, [x])) {
        this.__sendValue(x);
      }
    }
  }
)




// .diff(seed, fn)

createOneSourceClasses(
  'Diff',
  'diff',
  {
    __init: function(args) {
      this.__prev = args[0];
      this.__fn = new Callable(rest(args, 1));
    },
    __clean: function() {
      this.__prev = null;
      this.__fn = null;
    },
    __handleValue: function(x) {
      this.__sendValue(Callable.call(this.__fn, [this.__prev, x]));
      this.__prev = x;
    }
  }
)




// .takeWhile(fn)

createOneSourceClasses(
  'TakeWhile',
  'takeWhile',
  {
    __init: function(args) {
      this.__fn = new Callable(args);
    },
    __clean: function() {
      this.__fn = null;
    },
    __handleValue: function(x) {
      if (Callable.call(this.__fn, [x])) {
        this.__sendValue(x);
      } else {
        this.__sendEnd();
      }
    }
  }
)





// .take(n)

createOneSourceClasses(
  'Take',
  'take',
  {
    __init: function(args) {
      this.__n = args[0];
      if (this.__n <= 0) {
        this.__sendEnd();
      }
    },
    __handleValue: function(x) {
      this.__n--;
      this.__sendValue(x);
      if (this.__n === 0) {
        this.__sendEnd();
      }
    }
  }
)





// .skip(n)

createOneSourceClasses(
  'Skip',
  'skip',
  {
    __init: function(args) {
      this.__n = args[0];
    },
    __handleValue: function(x) {
      if (this.__n <= 0) {
        this.__sendValue(x);
      } else {
        this.__n--;
      }
    }
  }
)




// .skipDuplicates([fn])

function strictlyEqual(a, b) {  return a === b  }

createOneSourceClasses(
  'SkipDuplicates',
  'skipDuplicates',
  {
    __init: function(args) {
      if (args.length > 0) {
        this.__fn = new Callable(args);
      } else {
        this.__fn = strictlyEqual;
      }
      this.__prev = NOTHING;
    },
    __clean: function() {
      this.__fn = null;
      this.__prev = null;
    },
    __handleValue: function(x) {
      if (this.__prev === NOTHING || !Callable.call(this.__fn, [this.__prev, x])) {
        this.__sendValue(x);
      }
      this.__prev = x;
    }
  }
)





// .skipWhile(fn)

createOneSourceClasses(
  'SkipWhile',
  'skipWhile',
  {
    __init: function(args) {
      this.__fn = new Callable(args);
      this.__skip = true;
    },
    __clean: function() {
      this.__fn = null;
    },
    __handleValue: function(x) {
      if (!this.__skip) {
        this.__sendValue(x);
        return;
      }
      if (!Callable.call(this.__fn, [x])) {
        this.__skip = false;
        this.__fn = null;
        this.__sendValue(x);
      }
    }
  }
)



// property.changes()

var ChangesStream = createOneSourceClasses(
  'Changes'
).Stream;

Stream.prototype.changes = function() {
  return this;
}

Property.prototype.changes = function() {
  return new ChangesStream(this);
}









// To refactor using createOneSourceClasses() if posible:
//


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
  __handleBoth: function(type, x) {
    if (type === 'value') {
      this.__handle(x);
    } else {
      this.__sendError(x);
    }
  },
  __onFirstIn: function() {
    this.__source.onNewBoth(this.__handleBoth, this);
  },
  __onLastOut: function() {
    this.__source.offBoth(this.__handleBoth, this);
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
