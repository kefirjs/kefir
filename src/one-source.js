// TODO
//
// observable.debounce(wait, immediate)
// http://underscorejs.org/#defer


function createOneSourceClasses(classNamePrefix, methodName, methods) {

  var defaultMethods = {
    __init: function(args) {},
    __afterInitial: function(args) {},
    __free: function() {},
    __handleValue: function(x, initial) {  this.__sendValue(x)  },
    __handleError: function(e) {  this.__sendError(e)  },
    __handleEnd: function() {  this.__sendEnd()  },
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


  function AnonymousOneSourceStream(source, args) {
    Stream.call(this);
    this.__source = source;
    this.__init(args);
    this.__afterInitial(args);
    source.onEnd(this.__handleEnd, this);
  }

  inherit(AnonymousOneSourceStream, Stream, mixin, {
    __ClassName: classNamePrefix + 'Stream',
    __clear: function() {
      Stream.prototype.__clear.call(this);
      this.__source = null;
      this.__free();
    }
  });


  function AnonymousOneSourceProperty(source, args) {
    Property.call(this);
    this.__source = source;
    this.__init(args);
    if (source instanceof Property && source.hasValue()) {
      this.__handleValue(source.getValue(), true);
    }
    this.__afterInitial(args);
    source.onEnd(this.__handleEnd, this);
  }

  inherit(AnonymousOneSourceProperty, Property, mixin, {
    __ClassName: classNamePrefix + 'Property',
    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__source = null;
      this.__free();
    }
  });


  if (methodName) {
    Stream.prototype[methodName] = function() {
      return new AnonymousOneSourceStream(this, arguments);
    }
    Property.prototype[methodName] = function() {
      return new AnonymousOneSourceProperty(this, arguments);
    }
  }


  return {
    Stream: AnonymousOneSourceStream,
    Property: AnonymousOneSourceProperty
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
    __free: function() {
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
    __free: function() {
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
    __free: function() {
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
    __free: function() {
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
    __free: function() {
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
    __free: function() {
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





// observable.toProperty([initial])

var ToPropertyProperty = createOneSourceClasses(
  'ToProperty',
  null,
  {
    __afterInitial: function(initial) {
      if (initial !== NOTHING && !isUndefined(initial)) {
        this.__sendValue(initial);
      }
    }
  }
).Property;

Stream.prototype.toProperty = function(initial) {
  return new ToPropertyProperty(this, initial);
}

Property.prototype.toProperty = function(initial) {
  if (isUndefined(initial) || initial === NOTHING) {
    return this
  } else {
    return new ToPropertyProperty(this, initial);
  }
}





// .scan(seed, fn)

var ScanProperty = createOneSourceClasses(
  'Scan',
  null,
  {
    __init: function(args) {
      this.__sendValue(args[0]);
      this.__fn = new Callable(rest(args, 1));
    },
    __free: function(){
      this.__fn = null;
    },
    __handleValue: function(x) {
      this.__sendValue(Callable.call(this.__fn, [this.getValue(), x]));
    }
  }
).Property;

Observable.prototype.scan = function() {
  return new ScanProperty(this, arguments);
}





// .reduce(seed, fn)

var ReducedProperty = createOneSourceClasses(
  'Reduced',
  null,
  {
    __init: function(args) {
      this.__result = args[0];
      this.__fn = new Callable(rest(args, 1));
    },
    __free: function(){
      this.__fn = null;
      this.__result = null;
    },
    __handleValue: function(x) {
      this.__result = Callable.call(this.__fn, [this.__result, x]);
    },
    __handleEnd: function() {
      this.__sendValue(this.__result);
      this.__sendEnd();
    }
  }
).Property;

Observable.prototype.reduce = function() {
  return new ReducedProperty(this, arguments);
}






// .throttle(wait, {leading, trailing})

createOneSourceClasses(
  'Throttled',
  'throttle',
  {
    __init: function(args) {
      this.__wait = args[0];
      this.__leading = get(args[1], 'leading', true);
      this.__trailing = get(args[1], 'trailing', true);
      this.__trailingCallValue = null;
      this.__trailingCallTimeoutId = null;
      this.__endAfterTrailingCall = false;
      this.__lastCallTime = 0;
      var _this = this;
      this.__makeTrailingCallBinded = function() {  _this.__makeTrailingCall()  };
    },
    __free: function() {
      this.__trailingCallValue = null;
      this.__makeTrailingCallBinded = null;
    },
    __handleValue: function(x, initial) {
      if (initial) {
        this.__sendValue(x);
        return;
      }
      var curTime = now();
      if (this.__lastCallTime === 0 && !this.__leading) {
        this.__lastCallTime = curTime;
      }
      var remaining = this.__wait - (curTime - this.__lastCallTime);
      if (remaining <= 0) {
        this.__cancelTralingCall();
        this.__lastCallTime = curTime;
        this.__sendValue(x);
      } else if (this.__trailing) {
        this.__scheduleTralingCall(x, remaining);
      }
    },
    __handleEnd: function() {
      if (this.__trailingCallTimeoutId) {
        this.__endAfterTrailingCall = true;
      } else {
        this.__sendEnd();
      }
    },
    __scheduleTralingCall: function(value, wait) {
      if (this.__trailingCallTimeoutId) {
        this.__cancelTralingCall();
      }
      this.__trailingCallValue = value;
      this.__trailingCallTimeoutId = setTimeout(this.__makeTrailingCallBinded, wait);
    },
    __cancelTralingCall: function() {
      if (this.__trailingCallTimeoutId !== null) {
        clearTimeout(this.__trailingCallTimeoutId);
        this.__trailingCallTimeoutId = null;
      }
    },
    __makeTrailingCall: function() {
      this.__sendValue(this.__trailingCallValue);
      this.__trailingCallTimeoutId = null;
      this.__trailingCallValue = null;
      this.__lastCallTime = !this.__leading ? 0 : now();
      if (this.__endAfterTrailingCall) {
        this.__sendEnd();
      }
    }
  }
)







// .delay()

createOneSourceClasses(
  'Delayed',
  'delay',
  {
    __init: function(args) {
      this.__wait = args[0];
    },
    __handleValue: function(x, initial) {
      if (initial) {
        this.__sendValue(x);
        return;
      }
      var _this = this;
      setTimeout(function() {  _this.__sendValue(x)  }, this.__wait);
    },
    __handleEnd: function() {
      var _this = this;
      setTimeout(function() {  _this.__sendEnd()  }, this.__wait);
    }
  }
)
