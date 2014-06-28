

// .map(fn)

withOneSource('map', {
  __init: function(args) {
    this.__fn = new Callable(args);
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    this.__send('value', Callable.call(this.__fn, [x]));
  }
});





// .filter(fn)

withOneSource('filter', {
  __init: function(args) {
    this.__fn = new Callable(args);
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (Callable.call(this.__fn, [x])) {
      this.__send('value', x);
    }
  }
});




// .diff(seed, fn)

withOneSource('diff', {
  __init: function(args) {
    this.__prev = args[0];
    this.__fn = new Callable(rest(args, 1));
  },
  __free: function() {
    this.__prev = null;
    this.__fn = null;
  },
  __handleValue: function(x) {
    this.__send('value', Callable.call(this.__fn, [this.__prev, x]));
    this.__prev = x;
  }
});




// .takeWhile(fn)

withOneSource('takeWhile', {
  __init: function(args) {
    this.__fn = new Callable(args);
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (Callable.call(this.__fn, [x])) {
      this.__send('value', x);
    } else {
      this.__send('end');
    }
  }
});





// .take(n)

withOneSource('take', {
  __init: function(args) {
    this.__n = args[0];
    if (this.__n <= 0) {
      this.__send('end');
    }
  },
  __handleValue: function(x) {
    this.__n--;
    this.__send('value', x);
    if (this.__n === 0) {
      this.__send('end');
    }
  }
});





// .skip(n)

withOneSource('skip', {
  __init: function(args) {
    this.__n = args[0];
  },
  __handleValue: function(x) {
    if (this.__n <= 0) {
      this.__send('value', x);
    } else {
      this.__n--;
    }
  }
});




// .skipDuplicates([fn])

function strictlyEqual(a, b) {  return a === b  }

withOneSource('skipDuplicates', {
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
      this.__send('value', x);
    }
    this.__prev = x;
  }
});





// .skipWhile(fn)

withOneSource('skipWhile', {
  __init: function(args) {
    this.__fn = new Callable(args);
    this.__skip = true;
  },
  __free: function() {
    this.__fn = null;
  },
  __handleValue: function(x) {
    if (!this.__skip) {
      this.__send('value', x);
      return;
    }
    if (!Callable.call(this.__fn, [x])) {
      this.__skip = false;
      this.__fn = null;
      this.__send('value', x);
    }
  }
});





// .scan(seed, fn)

withOneSource('scan', {
  __init: function(args) {
    this.__send('value', args[0]);
    this.__fn = new Callable(rest(args, 1));
  },
  __free: function(){
    this.__fn = null;
  },
  __handleValue: function(x) {
    this.__send('value', Callable.call(this.__fn, [this.get('value'), x]));
  }
});







// .reduce(seed, fn)

withOneSource('reduce', {
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
    this.__send('value', this.__result);
    this.__send('end');
  }
});







// .throttle(wait, {leading, trailing})

withOneSource('throttle', {
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
      this.__send('value', x);
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
      this.__send('value', x);
    } else if (this.__trailing) {
      this.__scheduleTralingCall(x, remaining);
    }
  },
  __handleEnd: function() {
    if (this.__trailingCallTimeoutId) {
      this.__endAfterTrailingCall = true;
    } else {
      this.__send('end');
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
    this.__send('value', this.__trailingCallValue);
    this.__trailingCallTimeoutId = null;
    this.__trailingCallValue = null;
    this.__lastCallTime = !this.__leading ? 0 : now();
    if (this.__endAfterTrailingCall) {
      this.__send('end');
    }
  }
});







// .delay()

withOneSource('delay', {
  __init: function(args) {
    this.__wait = args[0];
  },
  __handleValue: function(x, initial) {
    if (initial) {
      this.__send('value', x);
      return;
    }
    var _this = this;
    setTimeout(function() {  _this.__send('value', x)  }, this.__wait);
  },
  __handleEnd: function() {
    var _this = this;
    setTimeout(function() {  _this.__send('end')  }, this.__wait);
  }
});



// .withHandler()
// TODO: tests

// withOneSource('withHandler', {
//   __init: function(args) {
//     var _this = this;
//     this.__handler = args[0];
//     this.__handlerContext = {
//       send: function(type, x) {  _this.__send(type, x)  }
//     }
//   },
//   __free: function() {
//     this.__handler = null;
//     this.__handlerContext = null;
//   },
//   __handleValue: function(x, initial) {
//     this.__handler.call(this.__handlerContext, 'value', x, initial);
//   },
//   __handleError: function(e, initial) {
//     this.__handler.call(this.__handlerContext, 'error', e, initial);
//   },
//   __handleEnd: function() {
//     this.__handler.call(this.__handlerContext, 'end');
//   }
// });






function withOneSource(name, mixin) {

  function AnonymousProperty(source, args) {
    Property.call(this);
    this.__source = source;
    this.__init(args);
    if (!this.__ended) {
      this.__source.on('end', [this.__handleEnd, this]);
    }
    if (!this.__ended && this.__source.has('value')) {
      this.__handleValue(this.__source.get('value'), true);
    }
    if (!this.__ended && this.__source.has('error')) {
      this.__handleError(this.__source.get('error'), true);
    }
  }

  inherit(AnonymousProperty, Property, {

    __name: capFirst(name) + 'Property',

    __init: function(args) {},
    __free: function() {},

    __handleValue: function(x, isInitial) {
      this.__send('value', x);
    },
    __handleError: function(e, isInitial) {
      this.__send('error', e);
    },
    __handleEnd: function() {
      this.__send('end');
    },

    __handleBoth: function(type, x) {
      if (type === 'value') {
        this.__handleValue(x);
      } else {
        this.__handleError(x);
      }
    },

    __onActivation: function() {
      this.__source.on('both', [this.__handleBoth, this]);
    },
    __onDeactivation: function() {
      this.__source.off('both', [this.__handleBoth, this]);
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__source = null;
      this.__free();
    }

  }, mixin);

  Property.prototype[name] = function() {
    return new AnonymousProperty(this, arguments);
  }
}
