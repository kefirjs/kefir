

// Kefir.withInterval()

withInterval('withInterval', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
    var _this = this;
    this._bindedSend = function(type, x) {  _this._send(type, x)  }
  },
  _free: function() {
    this._fn = null;
    this._bindedSend = null;
  },
  _onTick: function() {
    Fn.call(this._fn, [this._bindedSend]);
  }
});





// Kefir.fromPoll()

withInterval('fromPoll', {
  _init: function(args) {
    this._fn = new Fn(args[0]);
  },
  _free: function() {
    this._fn = null;
  },
  _onTick: function() {
    this._send('value', Fn.call(this._fn));
  }
});





// Kefir.interval()

withInterval('interval', {
  _init: function(args) {
    this._x = args[0];
  },
  _free: function() {
    this._x = null;
  },
  _onTick: function() {
    this._send('value', this._x);
  }
});




// Kefir.sequentially()

withInterval('sequentially', {
  _init: function(args) {
    this._xs = cloneArray(args[0]);
    if (this._xs.length === 0) {
      this._send('end')
    }
  },
  _free: function() {
    this._xs = null;
  },
  _onTick: function() {
    switch (this._xs.length) {
      case 0:
        this._send('end');
        break;
      case 1:
        this._send('value', this._xs[0]);
        this._send('end');
        break;
      default:
        this._send('value', this._xs.shift());
    }
  }
});




// Kefir.repeatedly()

withInterval('repeatedly', {
  _init: function(args) {
    this._xs = cloneArray(args[0]);
    this._i = -1;
  },
  _onTick: function() {
    if (this._xs.length > 0) {
      this._i = (this._i + 1) % this._xs.length;
      this._send('value', this._xs[this._i]);
    }
  }
});





// Kefir.later()

withInterval('later', {
  _init: function(args) {
    this._x = args[0];
  },
  _free: function() {
    this._x = null;
  },
  _onTick: function() {
    this._send('value', this._x);
    this._send('end');
  }
});
