// .setName

Observable.prototype.setName = function(sourceObs, selfName /* or just selfName */) {
  this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
  return this;
};



// .mapTo

Observable.prototype.mapTo = function(value) {
  return this.map(function() {  return value  }).setName(this, 'mapTo');
};



// .pluck

Observable.prototype.pluck = function(propertyName) {
  return this.map(function(x) {
    return x[propertyName];
  }).setName(this, 'pluck');
};



// .invoke

Observable.prototype.invoke = function(methodName /*, arg1, arg2... */) {
  var args = rest(arguments, 1);
  return this.map(args ?
    function(x) {  return apply(x[methodName], x, args)  } :
    function(x) {  return x[methodName]()  }
  ).setName(this, 'invoke');
};




// .timestamp

Observable.prototype.timestamp = function() {
  return this.map(function(x) {  return {value: x, time: now()}  }).setName(this, 'timestamp');
};




// .tap

Observable.prototype.tap = function(fn) {
  return this.map(function(x) {
    fn(x);
    return x;
  }).setName(this, 'tap');
};



// .and

Kefir.and = function(observables) {
  return Kefir.combine(observables, and).setName('and');
};

Observable.prototype.and = function(other) {
  return this.combine(other, and).setName('and');
};



// .or

Kefir.or = function(observables) {
  return Kefir.combine(observables, or).setName('or');
};

Observable.prototype.or = function(other) {
  return this.combine(other, or).setName('or');
};



// .not

Observable.prototype.not = function() {
  return this.map(not).setName(this, 'not');
};



// .awaiting

Observable.prototype.awaiting = function(other) {
  return Kefir.merge([
    this.mapTo(true),
    other.mapTo(false)
  ]).skipDuplicates().toProperty(false).setName(this, 'awaiting');
};




// .fromCallback

Kefir.fromCallback = function(callbackConsumer) {
  var called = false;
  return Kefir.fromBinder(function(emitter) {
    if (!called) {
      callbackConsumer(function(x) {
        emitter.emit(x);
        emitter.end();
      });
      called = true;
    }
    return noop;
  }).setName('fromCallback');
};





// ._fromEvent

Kefir._fromEvent = function(sub, unsub, transformer) {
  return Kefir.fromBinder(function(emitter) {
    var handler = transformer ? function() {
      emitter.emit(apply(transformer, this, arguments));
    } : emitter.emit;
    sub(handler);
    return function() {  unsub(handler)  };
  });
};




// .fromEvent

var subUnsubPairs = [
  ['addEventListener', 'removeEventListener'],
  ['addListener', 'removeListener'],
  ['on', 'off']
];

Kefir.fromEvent = function(target, eventName, transformer) {
  var pair, sub, unsub;

  for (var i = 0; i < subUnsubPairs.length; i++) {
    pair = subUnsubPairs[i];
    if (isFn(target[pair[0]]) && isFn(target[pair[1]])) {
      sub = pair[0];
      unsub = pair[1];
      break;
    }
  }

  if (sub === undefined) {
    throw new Error('target don\'t support any of addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
  }

  return Kefir._fromEvent(
    function(handler) {  target[sub](eventName, handler)  },
    function(handler) {  target[unsub](eventName, handler)  },
    transformer
  ).setName('fromEvent');
};


Kefir.fromPromise = function(promise) {
  return Kefir.fromBinder(function(emitter) {

    promise.then(function(value) {
      emitter.emit(value); // Success!
      emitter.end();
    }, function(err) {
      emitter.error(err); // Error!
      emitter.end();
    });

  }).setName('fromPromise');
};


Observable.prototype.toPromise = function(promiseCtor) {
  promiseCtor = promiseCtor || Promise;
  if (!promiseCtor) { throw new TypeError('Promise type not provided nor native Promise support'); }
  var source = this;
  return new promiseCtor(function (resolve, reject) {
    // No cancellation can be done
    var value, hasValue = false;
    source.onValue(function (v) {
      value = v;
      hasValue = true;
    });
    source.onEnd(function () {
      if (hasValue) resolve(value);
    });
    source.onError(reject);
  });
};