// Kefir.fromBinder(fn)

function FromBinder(fn) {
  Stream.call(this);
  this._fn = Fn(fn, 1);
  this._unsubscribe = null;
}

inherit(FromBinder, Stream, {

  _name: 'fromBinder',

  _onActivation: function() {
    var $ = this
      , isCurrent = true;
    this._unsubscribe = this._fn.invoke(function(type, x) {  $._send(type, x, isCurrent)  });
    isCurrent = false;
  },
  _onDeactivation: function() {
    if (isFn(this._unsubscribe)) {
      this._unsubscribe();
    }
    this._unsubscribe = null;
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
  emit: function(x) {  this._send('value', x)  },
  end: function() {  this._send('end')  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.never()

var neverObj = new Stream();
neverObj._send('end');
neverObj._name = 'never';
Kefir.never = function() {  return neverObj  }





// Kefir.constant(x)

function Constant(x) {
  Property.call(this);
  this._send('value', x);
  this._send('end');
}

inherit(Constant, Property, {
  _name: 'constant'
})

Kefir.constant = function(x) {
  return new Constant(x);
}



// Kefir.once(x)

function Once(x) {
  Stream.call(this);
  this._value = x;
}

inherit(Once, Stream, {
  _name: 'once',
  _onActivation: function() {
    this._send('value', this._value);
    this._send('end');
  }
});

Kefir.once = function(x) {
  return new Once(x);
}
