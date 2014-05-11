// I am not sure this tests are correct
//
// Run: node --expose-gc --allow-natives-syntax test-memory-usage.js
//
//   --allow-natives-syntax for %GetHeapUsage()
//   --expose-gc for global.gc()


var Kefir = require('./src/kefir.js');
var Bacon = require('./playground/bacon.js');



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
    objects[i].onValue(noop);
  }
  var withSubscribers = end()
  var objects = null;
  global.gc();

  console.log(msg + ': w/o subscr. ' + withoutSubscribers + ', w. subscr. ' + withSubscribers);
}

function noop(){}





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




console.log('\nnew Bus().toProperty(1) x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus().toProperty(1);
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus().toProperty(1);
})



console.log('\nnew Bus().toProperty(1).changes() x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus().toProperty(1).changes();
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus().toProperty(1).changes();
})



console.log('\nnew Bus().map(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus().map(noop);
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus().map(noop);
})




console.log('\n.sequentially(0, [1, 2])')

createNObservable('Kefir', 1000, function(){
  return Kefir.sequentially(0, [1, 2]);
})

createNObservable('Bacon', 1000, function(){
  return Bacon.sequentially(0, [1, 2]);
})





console.log('\nnew Bus().filter(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus().filter(noop);
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus().filter(noop);
})





console.log('\nnew Kefir.Bus().take(5) x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus().take(5);
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus().take(5);
})





console.log('\nnew Bus().flatMap(noop) x1000')

createNObservable('Kefir', 1000, function(){
  return new Kefir.Bus().flatMap(noop);
})

createNObservable('Bacon', 1000, function(){
  return new Bacon.Bus().flatMap(noop);
})




console.log('\n.fromBinder(noop).combine(Kefir.fromBinder(noop), noop) x500')

createNObservable('Kefir', 500, function(){
  return Kefir.fromBinder(noop).combine(Kefir.fromBinder(noop), noop);
})

createNObservable('Bacon', 500, function(){
  return Bacon.fromBinder(noop).combine(Bacon.fromBinder(noop), noop);
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




console.log('\n.combineAsArray(bus, bus, bus, bus) x300')

createNObservable('Kefir', 300, function(){
  return Kefir.combine([new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus()]);
})

createNObservable('Bacon', 300, function(){
  return Bacon.combineAsArray(new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus());
})




console.log('\n.mergeAll(bus, bus, bus, bus) x300')

createNObservable('Kefir', 300, function(){
  return Kefir.merge(new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus());
})

createNObservable('Bacon', 300, function(){
  return Bacon.mergeAll(new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus());
})

