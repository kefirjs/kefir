// Kefir.withInterval()

withInterval('withInterval', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
    var _this = this;
    this.__bindedSend = function(type, x) {  _this.__send(type, x)  }
  },
  __free: function() {
    this.__fn = null;
    this.__bindedSend = null;
  },
  __onTick: function() {
    Fn.call(this.__fn, [this.__bindedSend]);
  }
});





// Kefir.fromPoll()

withInterval('fromPoll', {
  __init: function(args) {
    this.__fn = new Fn(args[0]);
  },
  __free: function() {
    this.__fn = null;
  },
  __onTick: function() {
    this.__send('value', Fn.call(this.__fn));
  }
});





// Kefir.interval()

withInterval('interval', {
  __init: function(args) {
    this.__x = args[0];
  },
  __free: function() {
    this.__x = null;
  },
  __onTick: function() {
    this.__send('value', this.__x);
  }
});




// Kefir.sequentially()

withInterval('sequentially', {
  __init: function(args) {
    this.__xs = cloneArray(args[0]);
    if (this.__xs.length === 0) {
      this.__send('end')
    }
  },
  __free: function() {
    this.__xs = null;
  },
  __onTick: function() {
    switch (this.__xs.length) {
      case 0:
        this.__send('end');
        break;
      case 1:
        this.__send('value', this.__xs[0]);
        this.__send('end');
        break;
      default:
        this.__send('value', this.__xs.shift());
    }
  }
});




// Kefir.repeatedly()

withInterval('repeatedly', {
  __init: function(args) {
    this.__xs = cloneArray(args[0]);
    this.__i = -1;
  },
  __onTick: function() {
    if (this.__xs.length > 0) {
      this.__i = (this.__i + 1) % this.__xs.length;
      this.__send('value', this.__xs[this.__i]);
    }
  }
});





// Kefir.later()

withInterval('later', {
  __init: function(args) {
    this.__x = args[0];
  },
  __free: function() {
    this.__x = null;
  },
  __onTick: function() {
    this.__send('value', this.__x);
    this.__send('end');
  }
});









/// Utils

function withInterval(name, mixin) {

  function AnonymousProperty(wait, args) {
    Property.call(this);
    this.__wait = wait;
    this.__intervalId = null;
    var _this = this;
    this.__bindedOnTick = function() {  _this.__onTick()  }
    this.__init(args);
  }

  inherit(AnonymousProperty, Property, {

    __name: name,

    __init: function(args) {},
    __free: function() {},

    __onTick: function() {},

    __onActivation: function() {
      this.__intervalId = setInterval(this.__bindedOnTick, this.__wait);
    },
    __onDeactivation: function() {
      if (this.__intervalId !== null) {
        clearInterval(this.__intervalId);
        this.__intervalId = null;
      }
    },

    __clear: function() {
      Property.prototype.__clear.call(this);
      this.__bindedOnTick = null;
      this.__free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousProperty(wait, rest(arguments, 1, []));
  }
}
