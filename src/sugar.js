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
    function(x) {  return call(x[methodName], x, args)  } :
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



// .defer

Observable.prototype.defer = function() {
  return this.delay(0).setName(this, 'defer');
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
  return this.map(function(x) {  return !x  }).setName('not');
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
    .withHandler(function(send, e) {
      if (e.type === 'end') {
        send('end');
      } else if (e.value[0]) {
        send('value', e.value[1]);
      }
    })
    .setName(this, 'filterBy');
}

