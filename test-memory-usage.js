// I am not sure this tests are correct
//
// Run: node --expose-gc test-memory-usage.js


var Kefir = require('./dist/kefir.js');
var Bacon = require('baconjs');
var Rx = require('rx');



function diff(a, b) {
  return ( (b - a) / 1024 / 1024 ).toFixed(2) + ' Mb';
}

var __lastMemoryUsage;
function begin(){
  global.gc()
  __lastMemoryUsage = process.memoryUsage().heapUsed;
}
function end(name){
  global.gc()
  return diff(__lastMemoryUsage, process.memoryUsage().heapUsed);
}



function createNObservable(msg, n, generator){
  var objects = new Array(n);
  begin()
  for (var i = 0; i < objects.length; i++) {
    objects[i] = generator(i);
  }
  var withoutSubscribers = end()
  var objects = null;
  global.gc();

  var objects = new Array(n);
  begin()
  for (var i = 0; i < objects.length; i++) {
    objects[i] = generator(i);
    if (msg === 'Rx') {
      objects[i].subscribe(noop);
    } else {
      objects[i].onValue(noop);
    }
  }
  var withSubscribers = end();
  var objects = null;
  global.gc();

  console.log(msg + ': w/o subscr. ' + withoutSubscribers + ', w/ subscr. ' + withSubscribers);
}

function noop(){}


// Just keeps references to listeners
var fakeSource = {
  listeners: [],
  subscribe: function(listener){
    this.listeners.push(listener);
  },
  unsubscribe: function(listener){
    var index = this.listeners.indexOf(listener);
    if (index != -1) {
      this.listeners.splice(index, 1);
    }
  }
}


function baseKefir(){
  var stream = new Kefir.Stream(function(){
    fakeSource.subscribe(send);
  }, function(){
    fakeSource.unsubscribe(send);
  });
  var send = stream.__sendValue.bind(stream);
  return stream;
}

function baseRx(){
  return new Rx.Observable.create(function(observer){
    debugger
    var send = function(x){
      observer.onNext(x);
    }
    fakeSource.subscribe(send);
    return function(){
      fakeSource.unsubscribe(send);
    }
  });
}

function baseBacon(){
  return new Bacon.EventStream(function(sink){
    fakeSource.subscribe(sink);
    return function(){
      fakeSource.unsubscribe(sink);
    }
  });
}



console.log('\nvery base stream x500')

createNObservable('Kefir', 500, baseKefir)
createNObservable('Rx', 500, baseRx)
createNObservable('Bacon', 500, baseBacon)





console.log('\nnew Bus() x500')

createNObservable('Kefir', 500, function(){
  return new Kefir.Bus();
})

createNObservable('Bacon', 500, function(){
  return new Bacon.Bus();
})




console.log('\n.fromBinder(noop) x500')

createNObservable('Kefir', 500, function(){
  return Kefir.fromBinder(noop);
})

createNObservable('Bacon', 500, function(){
  return Bacon.fromBinder(noop);
})




console.log('\n.toProperty(1) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().toProperty(1);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().toProperty(1);
})



console.log('\n.toProperty(1).changes() x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().toProperty(1).changes();
})

createNObservable('Bacon', 500, function(){
  return baseBacon().toProperty(1).changes();
})



console.log('\n.map(noop) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().map(noop);
})

createNObservable('Rx', 500, function(){
  return baseRx().map(noop);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().map(noop);
})




console.log('\n.scan(0, noop) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().scan(0, noop);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().scan(0, noop);
})




console.log('\n.sequentially(0, [1, 2])')

createNObservable('Kefir', 500, function(){
  return Kefir.sequentially(0, [1, 2]);
})

createNObservable('Bacon', 500, function(){
  return Bacon.sequentially(0, [1, 2]);
})





console.log('\n.filter(noop) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().filter(noop);
})

createNObservable('Rx', 500, function(){
  return baseRx().filter(noop);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().filter(noop);
})





console.log('\n.take(5) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().take(5);
})

createNObservable('Rx', 500, function(){
  return baseRx().take(5);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().take(5);
})





console.log('\n.flatMap(noop) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().flatMap(noop);
})

createNObservable('Rx', 500, function(){
  return baseRx().flatMap(noop);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().flatMap(noop);
})




console.log('\n.combine(stream, noop) x500')

createNObservable('Kefir', 500, function(){
  return baseKefir().combine(baseKefir(), noop);
})

createNObservable('Rx', 500, function(){
  return baseRx().combineLatest(baseRx(), noop);
})

createNObservable('Bacon', 500, function(){
  return baseBacon().combine(baseBacon(), noop);
})




console.log('\n.once(1) x500')

createNObservable('Kefir', 500, function(i){
  return Kefir.once(i);
})

createNObservable('Bacon', 500, function(i){
  return Bacon.once(i);
})




console.log('\n.never() x500')

createNObservable('Kefir', 500, function(){
  return Kefir.never();
})

createNObservable('Bacon', 500, function(){
  return Bacon.never();
})




console.log('\n.combineAsArray(stream, stream, stream, stream) x150')

createNObservable('Kefir', 150, function(){
  return Kefir.combine([baseKefir(), baseKefir(), baseKefir(), baseKefir()]);
})

createNObservable('Bacon', 150, function(){
  return Bacon.combineAsArray(baseBacon(), baseBacon(), baseBacon(), baseBacon());
})




console.log('\n.mergeAll(stream, stream, stream, stream) x150')

createNObservable('Kefir', 150, function(){
  return Kefir.merge(baseKefir(), baseKefir(), baseKefir(), baseKefir());
})

createNObservable('Rx', 150, function(){
  return Rx.Observable.merge(baseRx(), baseRx(), baseRx(), baseRx());
})

createNObservable('Bacon', 150, function(){
  return Bacon.mergeAll(baseBacon(), baseBacon(), baseBacon(), baseBacon());
})




console.log('\ncrazy x50')

createNObservable('Kefir', 50, function(){
  return (baseKefir())
    .merge(Kefir.fromBinder(noop))
    .combine([Kefir.once(1)], noop)
    .scan(0, noop)
    .changes()
    .merge(Kefir.never().map(noop))
    .flatMap(noop)
    .take(5)
    .filter(noop)
    .merge(Kefir.sequentially(0, [1, 2]))
    .combine([Kefir.fromBinder(noop)], noop);
})

createNObservable('Bacon', 50, function(){
  return (baseBacon())
    .merge(Bacon.fromBinder(noop))
    .combine(Bacon.once(1), noop)
    .scan(0, noop)
    .changes()
    .merge(Bacon.never().map(noop))
    .flatMap(noop)
    .take(5)
    .filter(noop)
    .merge(Bacon.sequentially(0, [1, 2]))
    .combine(Bacon.fromBinder(noop), noop);
})


