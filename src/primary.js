const {inherit} = require('./utils/objects');
const Stream = require('./stream');
const Property = require('./property');
const {VALUE, ERROR, END} = require('./constants');



// Kefir.stream(fn)

function StreamStream(fn) {
  Stream.call(this);
  this._fn = fn;
  this._unsubscribe = null;
}

inherit(StreamStream, Stream, {

  _name: 'stream',

  _onActivation() {
    var $ = this
      , isCurrent = true
      , emitter = {
        emit(x) {
          $._send(VALUE, x, isCurrent);
        },
        error(x) {
          $._send(ERROR, x, isCurrent);
        },
        end() {
          $._send(END, null, isCurrent);
        },
        emitEvent(e) {
          $._send(e.type, e.value, isCurrent);
        }
      };
    this._unsubscribe = this._fn(emitter) || null;

    // fix https://github.com/pozadi/kefir/issues/35
    if (!this._active && this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }

    isCurrent = false;
  },
  _onDeactivation() {
    if (this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._fn = null;
  }

});







// Kefir.emitter()

function Emitter() {
  Stream.call(this);
}

inherit(Emitter, Stream, {
  _name: 'emitter',
  emit(x) {
    this._send(VALUE, x);
    return this;
  },
  error(x) {
    this._send(ERROR, x);
    return this;
  },
  end() {
    this._send(END);
    return this;
  },
  emitEvent(event) {
    this._send(event.type, event.value);
  }
});







// Kefir.never()

const neverInstance = new Stream();
neverInstance._send(END);
neverInstance._name = 'never';





// Kefir.constant(x)

function Constant(x) {
  Property.call(this);
  this._send(VALUE, x);
  this._send(END);
}

inherit(Constant, Property, {
  _name: 'constant'
});






// Kefir.constantError(x)

function ConstantError(x) {
  Property.call(this);
  this._send(ERROR, x);
  this._send(END);
}

inherit(ConstantError, Property, {
  _name: 'constantError'
});



// Kefir.repeat(generator)

function Repeat(generator) {
  Stream.call(this);
  this._generator = generator;
  this._source = null;
  this._inLoop = false;
  this._activating = false;
  this._iteration = 0;

  var $ = this;
  this._$handleAny = function(event) {
    $._handleAny(event);
  };
}

inherit(Repeat, Stream, {

  _name: 'repeat',

  _handleAny(event) {
    if (event.type === END) {
      this._source = null;
      this._startLoop();
    } else {
      this._send(event.type, event.value, this._activating);
    }
  },

  _startLoop() {
    if (!this._inLoop) {
      this._inLoop = true;
      while (this._source === null && this._alive && this._active) {
        this._source = this._generator(this._iteration++);
        if (this._source) {
          this._source.onAny(this._$handleAny);
        } else {
          this._send(END);
        }
      }
      this._inLoop = false;
    }
  },

  _onActivation() {
    this._activating = true;
    if (this._source) {
      this._source.onAny(this._$handleAny);
    } else {
      this._startLoop();
    }
    this._activating = false;
  },

  _onDeactivation() {
    if (this._source) {
      this._source.offAny(this._$handleAny);
    }
  },

  _clear() {
    Stream.prototype._clear.call(this);
    this._generator = null;
    this._source = null;
    this._$handleAny = null;
  }

});



module.exports = {StreamStream, Emitter, neverInstance, Constant, ConstantError, Repeat};
