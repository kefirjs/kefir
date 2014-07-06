

// Kefir.fromBinder(fn)

function FromBinderProperty(fn) {
  Property.call(this);
  this.__fn = new Fn(fn);
}

inherit(FromBinderProperty, Property, {

  __name: 'fromBinder',

  __onActivation: function() {
    var _this = this;
    this.__unsubscribe = Fn.call(this.__fn, [
      function(type, x) {  _this.__send(type, x)  }
    ]);
  },
  __onDeactivation: function() {
    if (isFn(this.__unsubscribe)) {
      this.__unsubscribe();
    }
    this.__unsubscribe = null;
  },

  __clear: function() {
    Property.prototype.__clear.call(this);
    this.__fn = null;
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
  __name: 'emitter',
  emit: function(type, x) {
    this.__send(type, x);
  }
});

Kefir.emitter = function() {
  return new Emitter();
}







// Kefir.empty()

var emptyObj = new Property();
emptyObj.__send('end');
emptyObj.__name = 'empty';
Kefir.empty = function() {  return emptyObj  }





// Kefir.constant(x)

function ConstantProperty(x) {
  Property.call(this);
  this.__send('value', x);
  this.__send('end');
}

inherit(ConstantProperty, Property, {
  __name: 'constant'
})

Kefir.constant = function(x) {
  return new ConstantProperty(x);
}




// Kefir.constantError(x)

function ConstantErrorProperty(x) {
  Property.call(this);
  this.__send('error', x);
  this.__send('end');
}

inherit(ConstantErrorProperty, Property, {
  __name: 'constantError'
})

Kefir.constantError = function(x) {
  return new ConstantErrorProperty(x);
}
