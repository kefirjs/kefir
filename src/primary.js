// Kefir.fromBinder(fn)

function FromBinder(fn) {
  Stream.call(this);
  this._fn = new Fn(fn);
  this._unsubscribe = null;
}

inherit(FromBinder, Stream, {

  _name: 'fromBinder',

  _onActivation: function() {
    var _this = this;
    var isCurrent = true;
    this._unsubscribe = Fn.call(this._fn, [
      function(type, x) {  _this._send(type, x, isCurrent)  }
    ]);
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

function ConstantProperty(x) {
  Property.call(this);
  this._send('value', x);
  this._send('end');
}

inherit(ConstantProperty, Property, {
  _name: 'constant'
})

Kefir.constant = function(x) {
  return new ConstantProperty(x);
}
