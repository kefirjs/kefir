// I am not sure this tests are correct
//
// Run: node --expose-gc --allow-natives-syntax test-memory-usage.js
//
//   --allow-natives-syntax for %GetHeapUsage()
//   --expose-gc for global.gc()


var Kefir = require('./dist/kefir.js');
var Bacon = require('baconjs');
var Rx = require('rx');



function diff(a, b) {
  return ( (b - a) / 1024 / 1024 ).toFixed(2) + ' Mb';
}

var __lastMemoryUsageCache;
function begin(){
  global.gc()
  __lastMemoryUsageCache = process.memoryUsage();
  // __lastMemoryUsageCache = %GetHeapUsage();
}
function end(name){
  global.gc()
  var now = process.memoryUsage();
  // var now = %GetHeapUsage();

  // var report = name + ':\n';
  // report += '  heapUsed ' + diff(__lastMemoryUsageCache.heapUsed, now.heapUsed) + '\n';
  // report += '  heapTotal ' + diff(__lastMemoryUsageCache.heapTotal, now.heapTotal) + '\n';
  // report += '  rss ' + diff(__lastMemoryUsageCache.rss, now.rss) + '\n';

  // var report = name + ': ' + diff(__lastMemoryUsageCache.heapUsed, now.heapUsed)

  // var report = name + ': ' + diff(__lastMemoryUsageCache, now)

  // console.log(report);
  return diff(__lastMemoryUsageCache.heapUsed, now.heapUsed);
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
  var withSubscribers = end()
  var objects = null;
  global.gc();

  console.log(msg + ': w/o subscr. ' + withoutSubscribers + ', w. subscr. ' + withSubscribers);
}

function noop(){}



function baseKefir(){
  return new Kefir.Stream(noop, noop);
}

function baseRx(){
  return new Rx.Observable.create(noop);
}

function baseBacon(){
  return new Bacon.EventStream(noop);
}



console.log('\nvery base stream x1000')

createNObservable('Kefir', 1000, baseKefir)
createNObservable('Rx', 1000, baseRx)
createNObservable('Bacon', 1000, baseBacon)





console.log('\nnew Bus() x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus();
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus();
})




console.log('\n.fromBinder(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return Kefir.fromBinder(noop);
})

createNObservable('Bacon', 1000, function(){
  return Bacon.fromBinder(noop);
})




console.log('\n.toProperty(1) x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().toProperty(1);
})

createNObservable('Bacon', 1000, function(){
  return baseBacon().toProperty(1);
})



console.log('\n.toProperty(1).changes() x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().toProperty(1).changes();
})

createNObservable('Bacon', 1000, function(){
  return baseBacon().toProperty(1).changes();
})



console.log('\n.map(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().map(noop);
})

createNObservable('Rx', 1000, function(){
  return baseRx().map(noop);
})

createNObservable('Bacon', 1000, function(){
  return baseBacon().map(noop);
})




console.log('\n.scan(0, noop) x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().scan(0, noop);
})

createNObservable('Bacon', 1000, function(){
  return baseBacon().scan(0, noop);
})




console.log('\n.sequentially(0, [1, 2])')

createNObservable('Kefir', 1000, function(){
  return Kefir.sequentially(0, [1, 2]);
})

createNObservable('Bacon', 1000, function(){
  return Bacon.sequentially(0, [1, 2]);
})





console.log('\n.filter(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().filter(noop);
})

createNObservable('Rx', 1000, function(){
  return baseRx().filter(noop);
})

createNObservable('Bacon', 1000, function(){
  return baseBacon().filter(noop);
})





console.log('\n.take(5) x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().take(5);
})

createNObservable('Rx', 1000, function(){
  return baseRx().take(5);
})

createNObservable('Bacon', 1000, function(){
  return baseBacon().take(5);
})





console.log('\n.flatMap(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return baseKefir().flatMap(noop);
})

createNObservable('Rx', 1000, function(){
  return baseRx().flatMap(noop);
})

createNObservable('Bacon', 1000, function(){
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




console.log('\n.once(1) x1000')

createNObservable('Kefir', 1000, function(i){
  return Kefir.once(i);
})

createNObservable('Bacon', 1000, function(i){
  return Bacon.once(i);
})




console.log('\n.never() x1000')

createNObservable('Kefir', 1000, function(){
  return Kefir.never();
})

createNObservable('Bacon', 1000, function(){
  return Bacon.never();
})




console.log('\n.combineAsArray(stream, stream, stream, stream) x300')

createNObservable('Kefir', 300, function(){
  return Kefir.combine([baseKefir(), baseKefir(), baseKefir(), baseKefir()]);
})

createNObservable('Bacon', 300, function(){
  return Bacon.combineAsArray(baseBacon(), baseBacon(), baseBacon(), baseBacon());
})




console.log('\n.mergeAll(stream, stream, stream, stream) x300')

createNObservable('Kefir', 300, function(){
  return Kefir.merge(baseKefir(), baseKefir(), baseKefir(), baseKefir());
})

createNObservable('Rx', 300, function(){
  return Rx.Observable.merge(baseRx(), baseRx(), baseRx(), baseRx());
})

createNObservable('Bacon', 300, function(){
  return Bacon.mergeAll(baseBacon(), baseBacon(), baseBacon(), baseBacon());
})




console.log('\ncrazy x100')

createNObservable('Kefir', 100, function(){
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

createNObservable('Bacon', 100, function(){
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


