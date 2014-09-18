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
      , unsub
      , isCurrent = true
      , emitter = {
        emit: function(x) {  $._send('value', x, isCurrent)  },
        end: function() {  $._send('end', null, isCurrent)  }
      };
    unsub = this._fn.invoke(emitter);
    isCurrent = false;
    if (unsub) {
      this._unsubscribe = Fn(unsub, 0);
    }
  },
  _onDeactivation: function() {
    if (this._unsubscribe !== null) {
      this._unsubscribe.invoke();
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

