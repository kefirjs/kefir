

// .merge()

withMultSource('merge', {
  _init: function(args) {
    var sources = agrsToArray(args);
    if (sources.length > 0) {
      this._multSubscriber.addAll(sources);
      this._multSubscriber.onLastRemoved([this._send, this, 'end']);
    } else {
      this._send('end');
    }
  }
});

Property.prototype.merge = function(other) {
  return Kefir.merge([this, other]);
}




// .combine()

withMultSource('combine', {
  _init: function(args) {
    this._sources = args[0];
    this._fn = args[1] ? new Fn(args[1]) : null;
    if (this._sources.length > 0) {
      this._multSubscriber.addAll(this._sources);
      this._multSubscriber.onLastRemoved([this._send, this, 'end']);
    } else {
      this._send('end');
    }
  },
  _free: function() {
    this._sources = null;
    this._fn = null;
  },
  _handleValue: function(x) {
    var xs = getValueAll(this._sources);
    if (xs !== null) {
      this._send('value', this._fn ? Fn.call(this._fn, xs) : xs);
    }
  }
});

Property.prototype.combine = function(other, fn) {
  return Kefir.combine([this, other], fn);
}








// .flatMap()

var FlatMapProperty = withMultSource('flatMap', {
  _init: function(args) {
    this._source = args[0];
    this._fn = args[1] ? new Fn(args[1]) : null;
  },
  _free: function() {
    this._source = null;
    this._fn = null;
  },
  _onActivationHook: function() {
    this._source.watch('any', [this._onAny, this]);
    if (!this.has('end')) {
      this._multSubscriber.onLastRemoved([this._endIfSourceEnded, this]);
    }
  },
  _onDeactivationHook: function() {
    this._source.off('any', [this._onAny, this]);
    this._multSubscriber.offLastRemoved();
  },
  _onValue: function(x) {
    this._multSubscriber.add(this._fn ? Fn.call(this._fn, [x]) : x);
  },
  _onError: function(e) {
    this._send('error', e);
  },
  _onAny: function(type, x) {
    switch (type) {
      case 'value': this._onValue(x); break;
      case 'error': this._onError(x); break;
      case 'end': this._endIfNoSubSources(); break;
    }
  },
  _endIfSourceEnded: function() {
    if (this._source.has('end')) {
      this._send('end');
    }
  },
  _endIfNoSubSources: function() {
    if (!this._multSubscriber.hasProperties()) {
      this._send('end');
    }
  }

}, false);

Property.prototype.flatMap = function(fn) {
  return new FlatMapProperty([this, fn]);
};






// .flatMapLatest()

function FlatMapLatestProperty() {
  FlatMapProperty.apply(this, arguments);
}

inherit(FlatMapLatestProperty, FlatMapProperty, {
  _name: 'flatMapLatest',
  _onValue: function(x) {
    this._multSubscriber.removeAll();
    FlatMapProperty.prototype._onValue.call(this, x);
  }
});

Property.prototype.flatMapLatest = function(fn) {
  return new FlatMapLatestProperty([this, fn]);
};






// .pool()

withMultSource('pool', {
  add: function(property) {
    this._multSubscriber.add(property);
  },
  remove: function(property) {
    this._multSubscriber.remove(property);
  }
});








// .sampledBy()

withMultSource('sampledBy', {
  _init: function(args) {
    var sources = args[0]
      , samplers = args[1];
    this._allSources = concat(sources, samplers);
    this._sourcesSubscriber = new MultSubscriber([this._passErrors, this]);
    this._sourcesSubscriber.addAll(sources);
    this._fn = args[2] ? new Fn(args[2]) : null;
    if (samplers.length > 0) {
      this._multSubscriber.addAll(samplers);
      this._multSubscriber.onLastRemoved([this._send, this, 'end']);
    } else {
      this._sourcesSubscriber.start();
      this._send('end');
    }
  },
  _passErrors: function(type, e) {
    if (type === 'error') {
      this._send(type, e);
    }
  },
  _free: function() {
    this._allSources = null;
    this._sourcesSubscriber.clear();
    this._sourcesSubscriber = null;
    this._fn = null;
  },
  _handleValue: function(x) {
    var xs = getValueAll(this._allSources);
    if (xs !== null) {
      this._send('value', this._fn ? Fn.call(this._fn, xs) : xs);
    }
  },
  _onPreActivationHook: function() {
    this._sourcesSubscriber.start();
  },
  _onDeactivationHook: function() {
    this._sourcesSubscriber.stop();
  }
});

Property.prototype.sampledBy = function(sampler, fn) {
  return Kefir.sampledBy([this], [sampler], fn || id);
}
