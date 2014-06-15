// TODO
//
// observable.filter(property)
// observable.takeWhile(property)
// observable.skipWhile(property)
//
// observable.awaiting(otherObservable)
// stream.skipUntil(stream2)



// tmp
var WithSourceStreamMixin = {
  __Constructor: function(source) {
    this.__source = source;
    source.onEnd(this.__sendEnd, this);
    if (source instanceof Property && this instanceof Property && source.hasValue()) {
      this.__handle(source.getValue());
    }
  },
  __handle: function(x) {
    this.__sendAny(x);
  },
  __handleBoth: function(type, x) {
    if (type === 'value') {
      this.__handle(x);
    } else {
      this.__sendError(x);
    }
  },
  __onFirstIn: function() {
    this.__source.onNewBoth(this.__handleBoth, this);
  },
  __onLastOut: function() {
    this.__source.offBoth(this.__handleBoth, this);
  },
  __clear: function() {
    Observable.prototype.__clear.call(this);
    this.__source = null;
  }
}





// .sampledBy(observable, fn)
// TODO: Kefir.sampledBy(streams, samplers, fn)

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
  __handleMainBoth: function(type, x) {
    if (type === 'value') {
      this.__lastValue = x;
    } else {
      this.__sendError(x);
    }
  },
  __onFirstIn: function() {
    WithSourceStreamMixin.__onFirstIn.call(this);
    this.__mainStream.onBoth(this.__handleMainBoth, this);
  },
  __onLastOut: function() {
    WithSourceStreamMixin.__onLastOut.call(this);
    this.__mainStream.offBoth(this.__handleMainBoth, this);
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
