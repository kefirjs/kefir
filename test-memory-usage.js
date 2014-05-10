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

  var report = name + ': ' + diff(__lastMemoryUsageCache.heapUsed, now.heapUsed)

  // var report = name + ': ' + diff(__lastMemoryUsageCache, now)

  console.log(report);
}




// begin('nothing 1')
// end('nothing 1')

// begin('nothing 2')
// end('nothing 2')

// begin('nothing 3')
// end('nothing 3')

// begin('nothing 4')
// end('nothing 4')

// begin('nothing 5')
// end('nothing 5')


// begin('empty array')
// var a = [];
// end('empty array')


// begin('empty fn')
// var b = function(){};
// end('empty fn')


// begin('empty object')
// var c = {};
// end('empty object')


// begin('remove empty array')
// var a = null;
// global.gc()
// end('remove empty array')


// begin('nothing 6')
// end('nothing 6')


// begin('nothing 7')
// end('nothing 7')



function noop(){}



console.log('\nnew Bus().map(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Kefir.Bus().map(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Bacon.Bus().map(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();




console.log('\nnew Kefir.Bus().take(5) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Kefir.Bus().take(5)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Bacon.Bus().take(5)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();




console.log('\nnew Bus().onValue(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Kefir.Bus()
    result[i].on(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Bacon.Bus()
    result[i].onValue(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();




console.log('\nnew Bus().flatMap(noop).onValue(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Kefir.Bus().flatMap(noop)
    result[i].on(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Bacon.Bus().flatMap(noop)
    result[i].onValue(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();





console.log('\nnew Bus().toProperty(1) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Kefir.Bus().toProperty(1)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = new Bacon.Bus().toProperty(1)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();




console.log('\n.fromBinder(noop).combine(Kefir.fromBinder(noop), noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Kefir.fromBinder(noop).combine(Kefir.fromBinder(noop), noop);
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Bacon.fromBinder(noop).combine(Bacon.fromBinder(noop), noop);
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();





console.log('\n.once(1).onValue(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Kefir.once(1);
    result[i].on(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Bacon.once(1);
    result[i].onValue(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();





console.log('\n.never().onValue(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Kefir.never();
    result[i].on(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Bacon.never();
    result[i].onValue(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();






console.log('\n.combineAsArray(bus, bus, bus, bus).onValue(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Kefir.combine([new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus()]);
    result[i].on(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Bacon.combineAsArray(new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus());
    result[i].onValue(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();






console.log('\n.mergeAll(bus, bus, bus, bus).onValue(noop) x1000')
begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Kefir.merge(new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus(), new Kefir.Bus());
    result[i].on(noop)
  };
  return result;
}())
end('Kefir')

var a = null;
global.gc();

begin()
var a = (function() {
  var result = new Array(1000);
  for (var i = 0; i < result.length; i++) {
    result[i] = Bacon.mergeAll(new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus(), new Bacon.Bus());
    result[i].onValue(noop)
  };
  return result;
}())
end('Bacon')

var a = null;
global.gc();
