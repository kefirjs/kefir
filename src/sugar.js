// .setName

Observable.prototype.setName = function(sourceObs, selfName /* or just selfName */) {
  this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
  return this;
}



// .mapTo

Observable.prototype.mapTo = function(value) {
  return this.map(function() {  return value  }).setName(this, 'mapTo');
}



// .pluck

Observable.prototype.pluck = function(propertyName) {
  return this.map(function(x) {
    return x[propertyName];
  }).setName(this, 'pluck');
}



// .invoke

Observable.prototype.invoke = function(methodName /*, arg1, arg2... */) {
  var args = rest(arguments, 1);
  return this.map(args ?
    function(x) {  return apply(x[methodName], x, args)  } :
    function(x) {  return x[methodName]()  }
  ).setName(this, 'invoke');
}



// .tap

Observable.prototype.tap = function(fn) {
  fn = Fn(fn, 1);
  return this.map(function(x) {
    fn.invoke(x);
    return x;
  }).setName(this, 'tap');
}



// .and

Kefir.and = function(observables) {
  return Kefir.combine(observables, and).setName('and');
}

Observable.prototype.and = function(other) {
  return this.combine(other, and).setName('and');
}



// .or

Kefir.or = function(observables) {
  return Kefir.combine(observables, or).setName('or');
}

Observable.prototype.or = function(other) {
  return this.combine(other, or).setName('or');
}



// .not

Observable.prototype.not = function() {
  return this.map(function(x) {  return !x  }).setName(this, 'not');
}



// .awaiting

Observable.prototype.awaiting = function(other) {
  return Kefir.merge([
    this.mapTo(true),
    other.mapTo(false)
  ]).skipDuplicates().toProperty(false).setName(this, 'awaiting');
}



// .filterBy

Observable.prototype.filterBy = function(other) {
  return other
    .sampledBy(this)
    .withHandler(function(emitter, e) {
      if (e.type === 'end') {
        emitter.end();
      } else if (e.value[0]) {
        emitter.emit(e.value[1]);
      }
    })
    .setName(this, 'filterBy');
}




// .fromCallback

Kefir.fromCallback = function(callbackConsumer) {
  callbackConsumer = Fn(callbackConsumer, 1);
  var called = false;
  return Kefir.fromBinder(function(emitter) {
    if (!called) {
      callbackConsumer.invoke(function(x) {
        emitter.emit(x);
        emitter.end();
      });
      called = true;
    }
  }).setName('fromCallback');
}




// .fromEvent

Kefir.fromEvent = function(target, eventName, transformer) {
  transformer = transformer && Fn(transformer);
  var sub = target.addEventListener || target.addListener || target.bind;
  var unsub = target.removeEventListener || target.removeListener || target.unbind;
  return Kefir.fromBinder(function(emitter) {
    var handler = transformer ?
      function() {
        emitter.emit(transformer.applyWithContext(this, arguments));
      } : emitter.emit;
    sub.call(target, eventName, handler);
    return function() {
      unsub.call(target, eventName, handler);
    }
  }).setName('fromEvent');
}
