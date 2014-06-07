// TODO
//
// observable.filter(property)
// observable.takeWhile(property)
// observable.skipWhile(property)
//
// observable.awaiting(otherObservable)
// stream.skipUntil(stream2)




// .sampledBy(observable, fn)

var SampledByMixin = {
  __Constructor: function(main, sampler, fnMeta) {
    if (this instanceof Property) {
      Property.call(this);
    } else {
      Stream.call(this);
    }
    this.__transformer = fnMeta && (new Callable(fnMeta));
    this.__mainStream = main;
    this.__lastValue = NOTHING;
    if (main instanceof Property && main.hasValue()) {
      this.__lastValue = main.getValue();
    }
    WithSourceStreamMixin.__Constructor.call(this, sampler);
  },
  __handle: function(y) {
    if (this.__lastValue !== NOTHING) {
      var x = this.__lastValue;
      if (this.__transformer) {
        x = Callable.call(this.__transformer, [x, y]);
      }
      this.__sendValue(x);
    }
  },
  __onFirstIn: function() {
    WithSourceStreamMixin.__onFirstIn.call(this);
    this.__mainStream.onValue(this.__saveValue, this);
    this.__mainStream.onError(this.__sendError, this);
  },
  __onLastOut: function() {
    WithSourceStreamMixin.__onLastOut.call(this);
    this.__mainStream.offValue(this.__saveValue, this);
    this.__mainStream.offError(this.__sendError, this);
  },
  __saveValue: function(x) {
    this.__lastValue = x;
  },
  __clear: function() {
    WithSourceStreamMixin.__clear.call(this);
    this.__lastValue = null;
    this.__fn = null;
    this.__mainStream = null;
  }
}

inheritMixin(SampledByMixin, WithSourceStreamMixin);

var SampledByStream = function SampledByStream() {
  this.__Constructor.apply(this, arguments);
}

inherit(SampledByStream, Stream, SampledByMixin, {
  __ClassName: 'SampledByStream'
})

var SampledByProperty = function SampledByProperty() {
  this.__Constructor.apply(this, arguments);
}

inherit(SampledByProperty, Property, SampledByMixin, {
  __ClassName: 'SampledByProperty'
})

Observable.prototype.sampledBy = function(observable/*fn[, context[, arg1, arg2, ...]]*/) {
  if (observable instanceof Stream) {
    return new SampledByStream(this, observable, rest(arguments, 1));
  } else {
    return new SampledByProperty(this, observable, rest(arguments, 1));
  }
}
