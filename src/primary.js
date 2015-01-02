// Kefir.fromBinder(fn)

function FromBinder(fn) {
  Stream.call(this);
  this._fn = fn;
  this._unsubscribe = null;
}

inherit(FromBinder, Stream, {

  _name: 'fromBinder',

  _onActivation: function() {
    var $ = this
      , isCurrent = true
      , emitter = {
        emit: function(x) {  $._send(VALUE, x, isCurrent)  },
        error: function(x) {  $._send(ERROR, x, isCurrent)  },
        end: function() {  $._send(END, null, isCurrent)  }
      };
    this._unsubscribe = this._fn(emitter) || null;
    isCurrent = false;
  },
  _onDeactivation: function() {
    if (this._unsubscribe !== null) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  },

  _clear: function() {
    Stream.prototype._clear.call(this);
    this._fn = null;
  }

})

Kefir.fromBinder = function(fn) {
  return new FromBinder(fn);
}






// Kefir.emitter()

function Emitter() {
  Stream.call(this);
}

inherit(Emitter, Stream, {
  _name: 'emitter',
  emit: function(x) {
    this._send(VALUE, x);
    return this;
  },
  error: function(x) {
    this._send(ERROR, x);
    return this;
  },
  end: function() {
    this._send(END);
    return this;
  }
});

Kefir.emitter = function() {
  return new Emitter();
}

Kefir.Emitter = Emitter;







// Kefir.never()

var neverObj = new Stream();
neverObj._send(END);
neverObj._name = 'never';
Kefir.never = function() {  return neverObj  }





// Kefir.constant(x)

function Constant(x) {
  Property.call(this);
  this._send(VALUE, x);
  this._send(END);
}

inherit(Constant, Property, {
  _name: 'constant'
})

Kefir.constant = function(x) {
  return new Constant(x);
}

