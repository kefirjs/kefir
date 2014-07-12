

// Kefir.fromBinder(fn)

function FromBinderProperty(fn) {
  Property.call(this);
  this._fn = new Fn(fn);
}

inherit(FromBinderProperty, Property, {

  _name: 'fromBinder',

  _onActivation: function() {
    var _this = this;
    this._unsubscribe = Fn.call(this._fn, [
      function(type, x) {  _this._send(type, x)  }
    ]);
  },
  _onDeactivation: function() {
    if (isFn(this._unsubscribe)) {
      this._unsubscribe();
    }
    this._unsubscribe = null;
  },

  _clear: function() {
    Property.prototype._clear.call(this);
    this._fn = null;
  }

})

Kefir.fromBinder = function(fn) {
  return new FromBinderProperty(fn);
}






// Kefir.emitter()

function Emitter() {
  Property.call(this);
}

inherit(Emitter, Property, {
  _name: 'emitter',
  emit: function(type, x) {
    this._send(type, x);
  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.empty()

var emptyObj = new Property();
emptyObj._send('end');
emptyObj._name = 'empty';
Kefir.empty = function() {  return emptyObj  }





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




// Kefir.constantError(x)

function ConstantErrorProperty(x) {
  Property.call(this);
  this._send('error', x);
  this._send('end');
}

inherit(ConstantErrorProperty, Property, {
  _name: 'constantError'
})

Kefir.constantError = function(x) {
  return new ConstantErrorProperty(x);
}
