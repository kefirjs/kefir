function createIntervalBasedStream(classNamePrefix, methodName, methods) {

  var defaultMethods = {
    __init: function(args) {},
    __free: function() {},
    __onTick: function() {}
  }

  var mixin = extend({
    __onFirstIn: function() {
      this.__intervalId = setInterval(this.__bindedOnTick, this.__wait);
    },
    __onLastOut: function() {
      if (this.__intervalId !== null) {
        clearInterval(this.__intervalId);
        this.__intervalId = null;
      }
    }
  }, defaultMethods, methods);

  function AnonymousIntervalBasedStream(wait, args) {
    Stream.call(this);
    this.__wait = wait;
    this.__intervalId = null;
    var _this = this;
    this.__bindedOnTick = function() {  _this.__onTick()  }
    this.__init(args);
  }

  inherit(AnonymousIntervalBasedStream, Stream, mixin, {
    __ClassName: classNamePrefix + 'Stream',
    __clear: function() {
      Stream.prototype.__clear.call(this);
      this.__bindedOnTick = null;
      this.__free();
    }
  });

  if (methodName) {
    Kefir[methodName] = function(wait) {
      return new AnonymousIntervalBasedStream(wait, rest(arguments, 1, []));
    }
  }

  return AnonymousIntervalBasedStream;

}




// Kefir.tiks()
// TODO: tests, docs

createIntervalBasedStream(
  'Tiks',
  'tiks',
  {
    __onTick: function() {
      this.__sendValue();
    }
  }
)




// Kefir.fromPoll()

createIntervalBasedStream(
  'FromPoll',
  'fromPoll',
  {
    __init: function(args) {
      this.__fn = new Callable(args);
    },
    __free: function() {
      this.__fn = null;
    },
    __onTick: function() {
      this.__sendAny(Callable.call(this.__fn));
    }
  }
)





// Kefir.interval()

createIntervalBasedStream(
  'Interval',
  'interval',
  {
    __init: function(args) {
      if (args.length > 0) {
        this.__x = args[0];
      } else {
        this.__x = undefined;
      }
    },
    __free: function() {
      this.__x = null;
    },
    __onTick: function() {
      if (this.__x === undefined) {
        this.__sendValue()
      } else {
        this.__sendAny(this.__x);
      }
    }
  }
)






// Kefir.sequentially()

createIntervalBasedStream(
  'Sequentially',
  'sequentially',
  {
    __init: function(args) {
      this.__xs = args[0].slice(0);
    },
    __free: function() {
      this.__xs = null;
    },
    __onTick: function() {
      if (this.__xs.length === 0) {
        this.__sendEnd();
        return;
      }
      this.__sendAny(this.__xs.shift());
      if (this.__xs.length === 0) {
        this.__sendEnd();
      }
    }
  }
)





// Kefir.repeatedly()

createIntervalBasedStream(
  'Repeatedly',
  'repeatedly',
  {
    __init: function(args) {
      this.__xs = args[0].slice(0);
      this.__i = -1;
    },
    __onTick: function() {
      this.__i = (this.__i + 1) % this.__xs.length;
      this.__sendAny(this.__xs[this.__i]);
    }
  }
)






// Kefir.later()

createIntervalBasedStream(
  'Later',
  'later',
  {
    __init: function(args) {
      this.__x = args[0];
    },
    __free: function() {
      this.__x = null
    },
    __onTick: function() {
      this.__sendAny(this.__x);
      this.__sendEnd();
    }
  }
)
